'use strict';

import * as net from 'net';
import * as path from 'path';
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, generateRandomPipeName, StreamInfo } from 'vscode-languageclient';

export function activate(context: vscode.ExtensionContext) {

    const config = vscode.workspace.getConfiguration('tenkawaphp');
    const phpExecutable = config.get<string>('executablePath') || 'php';
    const serverExecutable = context.asAbsolutePath(path.join('vendor', 'bin', 'tenkawa.php'));
    const memoryLimit = '1024M';

    const args = [
        '-dmemory_limit=' + memoryLimit,
        serverExecutable,
        '--log-stderr',
        '--log-level=info',
    ];

    let serverOptions: ServerOptions;
    serverOptions = () => new Promise<StreamInfo>((resolve, reject) => {
        const server = net.createServer(socket => {
            server.close();
            resolve({ reader: socket, writer: socket });
        });

        server.listen(0, '127.0.0.1', () => {
            const childProcess = spawn(
                phpExecutable,
                args.concat([`--socket=tcp://${server.address().address}:${server.address().port}`]),
            );

            childProcess.stderr.on('data', chunk => {
                client.outputChannel.append(chunk + '');
            });

            childProcess.stdout.on('data', chunk => {
                client.outputChannel.append(chunk + '');
            });

            let showError = () => {
                vscode.window.showErrorMessage(
                    'PHP language server could not be started. ' +
                    'Please set "tenkawaphp.executablePath" option to a PHP>=7.0 executable'
                );
                showError = () => {};
            };

            childProcess.on('error', error => showError());
            childProcess.on('exit', (code, signal) => {
                if (signal === null && code === 1) {
                    showError();
                }
            });
        });
    });

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'php' },
            { scheme: 'untitled', language: 'php' }
        ],
    };

    const client = new LanguageClient('Tenkawa PHP', serverOptions, clientOptions);
    const disposable = client.start();
    context.subscriptions.push(disposable);
}