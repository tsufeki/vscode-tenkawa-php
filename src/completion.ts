import { Middleware, ProvideCompletionItemsSignature } from "vscode-languageclient";
import {
    CancellationToken,
    CompletionContext as VCompletionContext,
    CompletionItem as VCompletionItem,
    CompletionList as VCompletionList,
    Position as VPosition,
    ProviderResult,
    TextDocument as VTextDocument,
} from 'vscode';

export class TriggerSignatureHelpAfterCompletionMiddleware implements Middleware {

    provideCompletionItem(
        this: void,
        document: VTextDocument,
        position: VPosition,
        context: VCompletionContext,
        token: CancellationToken,
        next: ProvideCompletionItemsSignature,
    ): ProviderResult<VCompletionItem[] | VCompletionList> {
        return Promise.resolve(next(document, position, context, token))
            .then(TriggerSignatureHelpAfterCompletionMiddleware.addCommands);
    }

    private static addCommands(completionList: VCompletionItem[] | VCompletionList | null | undefined) {
        if (completionList !== null && completionList !== undefined) {
            const items = completionList instanceof Array ? completionList : completionList.items;
            items.forEach(item => {
                if (typeof item.insertText === 'string' && item.insertText.endsWith('(')) {
                    item.command = {
                        command: 'editor.action.triggerParameterHints',
                        title: 'signature help',
                    };
                }
            });
        }

        return completionList;
    }
}
