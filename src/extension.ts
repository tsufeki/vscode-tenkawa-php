'use strict';

import * as net from 'net';
import * as path from 'path';
import { spawn } from 'child_process';
import { ExtensionContext, Disposable } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, generateRandomPipeName, StreamInfo } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

    const phpExecutable = 'php';
    const serverExecutable = context.asAbsolutePath(path.join('vendor', 'tsufeki', 'tenkawa-php-language-server', 'bin', 'tenkawa.php'));

    const serverOptions: ServerOptions = () => new Promise<StreamInfo>((resolve, reject) => {
        const socketPath = generateRandomPipeName();
        const server = net.createServer(socket => {
            server.close();
            resolve({ reader: socket, writer: socket });
        });

        server.listen(socketPath, () => {
            const childProcess = spawn(
                phpExecutable,
                [
                    '-dmemory_limit=1024M',
                    serverExecutable,
                    '--socket=' + socketPath,
                    '--log=' + context.asAbsolutePath('tenkawa.log'),
                ],
            );

            childProcess.stderr.on('data', (chunk: Buffer) => {
                console.error(chunk + '');
            });
            childProcess.stdout.on('data', (chunk: Buffer) => {
                console.log(chunk + '');
            });
        });
    });

    const clientOptions: LanguageClientOptions = {
        documentSelector: ['php'],
    };

    const client = new LanguageClient('Tenkawa PHP', serverOptions, clientOptions);

    const disposable = client.start();
    context.subscriptions.push(disposable);
}