import {
    Toast,
    Type,
    makeErrorToast,
    makeInfoToast,
    makeSuccessToast,
    makeWarningToast,
} from "../components/toaster/Toast";
import { ToastInfo } from "../components/toaster/ToastInfo";

export interface ToastProviderView {
    setToastInfo: (value: ToastInfo) => void,
    getToastInfo: () => ToastInfo
}

export class ToastProviderPresenter {
    private view: ToastProviderView;

    public constructor(view: ToastProviderView) {
        this.view = view;
    }

    public displayToast = (toast: Toast) => {
        const { toastList } = this.view.getToastInfo();
        toastList.push(toast);

        this.view.setToastInfo({ ...this.view.getToastInfo(), ...toastList });
    };

    public displaySuccessToast = (
        message: string,
        duration: number,
        bootstrapClasses: string = ""
    ): string => {
        const toast = makeSuccessToast(message, duration, bootstrapClasses);
        this.displayToast(toast);
        return toast.id;
    };

    public displayErrorToast = (
        message: string,
        duration: number,
        bootstrapClasses: string = ""
    ): string => {
        const toast = makeErrorToast(message, duration, bootstrapClasses);
        this.displayToast(toast);
        return toast.id;
    };

    public displayInfoToast = (
        message: string,
        duration: number,
        bootstrapClasses: string = ""
    ): string => {
        const toast = makeInfoToast(message, duration, bootstrapClasses);
        this.displayToast(toast);
        return toast.id;
    };

    public displayWarningToast = (
        message: string,
        duration: number,
        bootstrapClasses: string = ""
    ): string => {
        const toast = makeWarningToast(message, duration, bootstrapClasses);
        this.displayToast(toast);
        return toast.id;
    };

    public deleteToast = (id: string) => {
        const { toastList } = this.view.getToastInfo();
        const listItemIndex = toastList.findIndex((x) => x.id === id);

        toastList.splice(listItemIndex, 1);
        this.view.setToastInfo({ ...this.view.getToastInfo(), ...toastList });
    };

    public deleteAllToasts = () => {
        this.view.setToastInfo({ ...this.view.getToastInfo(), ...{ toastList: [] } });
    };

    public deleteAllSuccessToasts = () => {
        this.deleteAllToastsOfType(Type.Success);
    };

    public deleteAllErrorToasts = () => {
        this.deleteAllToastsOfType(Type.Error);
    };

    public deleteAllInfoToasts = () => {
        this.deleteAllToastsOfType(Type.Info);
    };

    public deleteAllWarningToasts = () => {
        this.deleteAllToastsOfType(Type.Warning);
    };

    public deleteAllToastsOfType = (type: Type) => {
        for (let toast of this.view.getToastInfo().toastList) {
            if (toast.type === type) {
                this.deleteToast(toast.id);
            }
        }
    };

    public deleteLastToast = () => {
        const { toastList } = this.view.getToastInfo();

        if (!!toastList && toastList.length > 0) {
            this.deleteToast(toastList[toastList.length - 1].id);
        }
    };

    public deleteLastSuccessToast = () => {
        this.deleteLastTypedToast(Type.Success);
    };

    public deleteLastErrorToast = () => {
        this.deleteLastTypedToast(Type.Error);
    };

    public deleteLastInfoToast = () => {
        this.deleteLastTypedToast(Type.Info);
    };

    public deleteLastWarningToast = () => {
        this.deleteLastTypedToast(Type.Warning);
    };

    public deleteLastTypedToast = (type: Type) => {
        const { toastList } = this.view.getToastInfo();

        if (!!toastList && toastList.length > 0) {
            let index = toastList.length - 1;

            do {
                if (toastList[index].type === type) {
                    this.deleteToast(toastList[index].id);
                    break;
                }

                index--;
            } while (index >= 0);
        }
    };

}
