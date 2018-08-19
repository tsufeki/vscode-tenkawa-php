import { NotificationType, Disposable } from "vscode-jsonrpc";
import { LanguageClient } from "vscode-languageclient";
import { Progress, window, ProgressLocation } from "vscode";

interface ProgressNotificationParams {
    id: string | number;
    label: string;
    status?: number;
    done?: boolean;
}

namespace ProgressNotification {
    export const type = new NotificationType<ProgressNotificationParams, void>('$/tenkawaphp/window/progress');
}

class ProgressItem {
    progress?: Progress<{ message?: string }>;
    resolve?: ({}) => void;

    set(params: ProgressNotificationParams): void {
        if (this.progress) {
            const message = params.label;
            this.progress.report({ message });
        }
    }

    done(): void {
        if (this.resolve) {
            this.resolve({});
        }
    }
}

export class ProgressFeature {

    private progressItems = new Map<ProgressNotificationParams['id'], ProgressItem>();

    constructor(private client: LanguageClient) {}

    initialize(): Disposable {
        this.client.onReady().then(() => this.client.onNotification(ProgressNotification.type, params => {
            this.onProgressNotification(params);
        }));

        return Disposable.create(() => this.cleanup());
    }

    private onProgressNotification(params: ProgressNotificationParams): void {
        if (!this.progressItems.has(params.id)) {
            if (params.done) {
                return;
            }
            const progressItem = new ProgressItem();
            this.progressItems.set(params.id, progressItem);
            window.withProgress({
                "cancellable": false,
                "location": ProgressLocation.Notification,
            }, progress => {
                progressItem.progress = progress;
                progressItem.set(params);
                return new Promise<{}>((resolve, reject) => {
                    progressItem.resolve = resolve;
                });
            });
        } else {
            const progressItem = this.progressItems.get(params.id);
            progressItem.set(params);
            if (params.done) {
                this.progressItems.delete(params.id);
                progressItem.done();
            }
        }
    }

    cleanup(): void {
        this.progressItems.forEach(progressItem => progressItem.done());
    }
}
