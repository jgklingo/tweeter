export interface View { }

export interface ErrorView extends View {
    displayErrorMessage: (message: string) => void;
}

export interface MessageView extends ErrorView {
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class Presenter<V extends View> {
    private _view: V;

    protected constructor(view: V) {
        this._view = view;
    }

    protected get view(): V {
        return this._view
    }
}

export class ErrorPresenter<V extends ErrorView> extends Presenter<V> {
    protected async doFailureReportingOperation(
        operation: () => Promise<void>,
        operationDescription: string,
        finallyOperation: () => void = () => { }
    ) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${operationDescription} because of exception: ${error}`
            );
        } finally {
            finallyOperation();
        }
    };
}
