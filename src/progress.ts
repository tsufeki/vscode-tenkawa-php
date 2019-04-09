import { NotificationType, Disposable } from "vscode-jsonrpc";
import { LanguageClient } from "vscode-languageclient";
import { Progress, window, ProgressLocation, commands } from "vscode";

interface ProgressNotificationParams {
    id: string | number;
    label?: string;
    status?: number;
    done?: boolean;
}

namespace ProgressNotification {
    export const type = new NotificationType<ProgressNotificationParams, void>('$/tenkawaphp/window/progress');
}

class ProgressItem {
    private lastMessage: string | undefined;

    private constructor(
        private progress: Progress<{ message?: string }>,
        private resolve: ({}) => void,
    ) {}

    static create(): Promise<ProgressItem> {
        let doneResolver: (v: {}) => void;
        const donePromise = new Promise<{}>(resolve => doneResolver = resolve);

        const progressPromise = new Promise<ProgressItem['progress']>((resolve) => {
            window.withProgress({
                "cancellable": false,
                "location": ProgressLocation.Notification,
            }, progress => {
                resolve(progress);
                return donePromise;
            });
        });

        return progressPromise.then(progress => new ProgressItem(progress, doneResolver));
    }

    update(params: ProgressNotificationParams): void {
        const message = params.label;
        if (message && this.lastMessage !== message) {
            this.lastMessage = message;
            this.progress.report(this.format(message));
        }
    }

    private format(message: string): { message?: string } {
        return { message: `[php] ${message}` };
    }

    done(): void {
        this.resolve({});
    }
}

export class ProgressFeature {

    private progressItems = new Map<ProgressNotificationParams['id'], Promise<ProgressItem>>();

    constructor(private client: LanguageClient) {}

    initialize(): Disposable {
        this.client.onReady().then(() => this.client.onNotification(ProgressNotification.type, params => {
            this.onProgressNotification(params);
        }));

        return Disposable.create(() => this.cleanup());
    }

    private getProgressItem(id: ProgressNotificationParams['id']): Promise<ProgressItem> {
        let item = this.progressItems.get(id);
        if (item === undefined) {
            item = ProgressItem.create();
            this.progressItems.set(id, item);
        }
        return item;
    }

    private onProgressNotification(params: ProgressNotificationParams): void {
        this.getProgressItem(params.id).then(progressItem => {
            progressItem.update(params);
            if (params.done) {
                this.progressItems.delete(params.id);
                progressItem.done();
            }
        });
    }

    cleanup(): void {
        this.progressItems.forEach(progressItem => progressItem.then(p => p.done()));
    }
}
