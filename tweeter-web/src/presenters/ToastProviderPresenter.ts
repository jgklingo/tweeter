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
    setToastInfo: (value: ToastInfo) => void
}

export class ToastProviderPresenter {
    private view: ToastProviderView;

    public constructor(view: ToastProviderView) {
        this.view = view;
    };

    public displayToast = (toast: Toast, toastInfo: ToastInfo) => {
        const { toastList } = toastInfo;
        toastList.push(toast);

        this.view.setToastInfo({ ...toastInfo, ...toastList });
    };

    public displaySuccessToastGenerator(toastInfo: ToastInfo) {
        return (message: string, duration: number, bootstrapClasses: string = ""): string => {
            const toast = makeSuccessToast(message, duration, bootstrapClasses);
            this.displayToast(toast, toastInfo);
            return toast.id;
        };
    };

    public displayErrorToastGenerator(toastInfo: ToastInfo) {
        return (message: string, duration: number, bootstrapClasses: string = ""): string => {
            const toast = makeErrorToast(message, duration, bootstrapClasses);
            this.displayToast(toast, toastInfo);
            return toast.id;
        };
    };

    public displayInfoToastGenerator(toastInfo: ToastInfo) {
        return (message: string, duration: number, bootstrapClasses: string = ""): string => {
            const toast = makeInfoToast(message, duration, bootstrapClasses);
            this.displayToast(toast, toastInfo);
            return toast.id;
        };
    };

    public displayWarningToastGenerator(toastInfo: ToastInfo) {
        return (message: string, duration: number, bootstrapClasses: string = ""): string => {
            const toast = makeWarningToast(message, duration, bootstrapClasses);
            this.displayToast(toast, toastInfo);
            return toast.id;
        };
    };

    public deleteToastGenerator(toastInfo: ToastInfo) {
        return (id: string) => {
            const { toastList } = toastInfo;
            const listItemIndex = toastList.findIndex((x) => x.id === id);

            toastList.splice(listItemIndex, 1);
            this.view.setToastInfo({ ...toastInfo, ...toastList });
        };
    };

    public deleteAllToastsGenerator(toastInfo: ToastInfo) {
        return () => {
            this.view.setToastInfo({ ...toastInfo, ...{ toastList: [] } });
        };
    };

    public deleteAllSuccessToastsGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteAllToastsOfTypeGenerator(toastInfo)(Type.Success);
        };
    };

    public deleteAllErrorToastsGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteAllToastsOfTypeGenerator(toastInfo)(Type.Error);
        };
    };

    public deleteAllInfoToastsGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteAllToastsOfTypeGenerator(toastInfo)(Type.Info);
        };
    };

    public deleteAllWarningToastsGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteAllToastsOfTypeGenerator(toastInfo)(Type.Warning);
        };
    };

    public deleteAllToastsOfTypeGenerator(toastInfo: ToastInfo) {
        return (type: Type) => {
            for (let toast of toastInfo.toastList) {
                if (toast.type === type) {
                    this.deleteToastGenerator(toastInfo)(toast.id);
                }
            }
        };
    }

    public deleteLastToastGenerator(toastInfo: ToastInfo) {
        return () => {
            const { toastList } = toastInfo;

            if (!!toastList && toastList.length > 0) {
                this.deleteToastGenerator(toastInfo)(toastList[toastList.length - 1].id);
            }
        };
    }

    public deleteLastSuccessToastGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteLastTypedToastGenerator(toastInfo)(Type.Success);
        };
    }

    public deleteLastErrorToastGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteLastTypedToastGenerator(toastInfo)(Type.Error);
        };
    }

    public deleteLastInfoToastGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteLastTypedToastGenerator(toastInfo)(Type.Info);
        };
    }

    public deleteLastWarningToastGenerator(toastInfo: ToastInfo) {
        return () => {
            this.deleteLastTypedToastGenerator(toastInfo)(Type.Warning);
        };
    }

    public deleteLastTypedToastGenerator(toastInfo: ToastInfo) {
        return (type: Type) => {
            const { toastList } = toastInfo;

            if (!!toastList && toastList.length > 0) {
                let index = toastList.length - 1;

                do {
                    if (toastList[index].type === type) {
                        this.deleteToastGenerator(toastInfo)(toastList[index].id);
                        break;
                    }

                    index--;
                } while (index >= 0);
            }
        };
    }
}
