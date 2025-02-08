import { Toast } from "../components/toaster/Toast";

export interface ToasterView {
    deleteToast: (id: string) => void
}

export class ToasterPresenter {
    private view: ToasterView;

    public constructor(view: ToasterView) {
        this.view = view;
    }

    public deleteExpiredToasts(toastList: Toast[]) {
        const now = Date.now();

        for (let toast of toastList) {
            if (
                toast.expirationMillisecond > 0 &&
                toast.expirationMillisecond < now
            ) {
                this.view.deleteToast(toast.id);
            }
        }
    };
}
