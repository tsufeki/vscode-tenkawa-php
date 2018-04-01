'use strict';

import * as net from 'net';
import * as path from 'path';
import { spawn } from 'child_process';
import { ExtensionContext, Disposable, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, generateRandomPipeName, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

    const config = workspace.getConfiguration('tenkawaphp');
    const phpExecutable = config.get<string>('executablePath') || 'php';
    const serverExecutable = context.asAbsolutePath(path.join('tenkawa-php-language-server', 'bin', 'tenkawa.php'));
    const memoryLimit = '1024M';
    const logDestination = context.asAbsolutePath('tenkawa-php.log');

    const args = [
        '-dmemory_limit=' + memoryLimit,
        serverExecutable,
        '--log=' + logDestination,
    ];

    let serverOptions: ServerOptions;
    if (process.platform !== 'win32') {
        serverOptions = {
            command: phpExecutable,
            args,
        };
    } else {
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

                childProcess.stderr.on('data', (chunk: Buffer) => {
                    console.error(chunk + '');
                });
                childProcess.stdout.on('data', (chunk: Buffer) => {
                    console.error(chunk + '');
                });
            });
        });
    }

    const clientOptions: LanguageClientOptions = {
        documentSelector: ['php'],
    };

    const client = new LanguageClient('Tenkawa PHP', serverOptions, clientOptions);
    const disposable = client.start();
    context.subscriptions.push(disposable);
}