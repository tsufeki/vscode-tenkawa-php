'use strict';

import * as path from 'path';
import { ExtensionContext, Disposable } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {

    let phpExecutable = 'php';
    let serverExecutable = context.asAbsolutePath(path.join('vendor', 'tsufeki', 'tenkawa-php-language-server', 'bin', 'tenkawa.php'));

    const serverOptions: ServerOptions = {
        command: phpExecutable,
        args: [serverExecutable],
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: ['php'],
    };

    const client = new LanguageClient('Tenkawa PHP', serverOptions, clientOptions);

    const disposable = client.start();
    context.subscriptions.push(disposable);
}