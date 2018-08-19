'use strict';

import * as net from 'net';
import * as path from 'path';
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    StreamInfo,
    RevealOutputChannelOn,
} from 'vscode-languageclient';
import { ProgressFeature } from './progress';

namespace Errors {
    const messages = {
        '': 'Please set "tenkawaphp.executablePath" option to a PHP>=7.1 executable',
        '1': 'Please set "tenkawaphp.executablePath" option to a PHP>=7.1 executable',
        '2': 'Required "pdo_sqlite" PHP extension is missing',
        '3': 'Required "mbstring" PHP extension is missing',
        '9': 'VS Code extension was not properly installed',
    };

    let shown = false;

    export function show(code?: number) {
        if (shown) {
            return;
        }
        shown = true;

        const key = code ? code.toString() : '';
        const msg = messages[key];
        if (msg === undefined) {
            return;
        }

        vscode.window.showErrorMessage(
            'PHP language server could not be started. ' + msg
        );
    }
}

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

            childProcess.on('error', error => Errors.show());
            childProcess.on('exit', (code, signal) => {
                if (signal === null) {
                    Errors.show(code);
                }
            });
        });
    });

    const clientOptions: LanguageClientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'php' },
            { scheme: 'untitled', language: 'php' }
        ],
        initializationOptions: {
            tenkawaphp: {
                diagnostics: config.get('diagnostics'),
                completion: config.get('completion'),
            },
        },
        revealOutputChannelOn: RevealOutputChannelOn.Never,
    };

    const client = new LanguageClient('tenkawaphp', 'Tenkawa PHP', serverOptions, clientOptions);
    let disposable = client.start();
    context.subscriptions.push(disposable);

    disposable = new ProgressFeature(client).initialize();
    context.subscriptions.push(disposable);
}
