import { Toast } from "./Toast";

export interface ToastInfo {
    toastList: Toast[];
    displaySuccessToast: (
        message: string,
        duration: number,
        bootstrapClasses?: string
    ) => void;
    displayErrorToast: (
        message: string,
        duration: number,
        bootstrapClasses?: string
    ) => void;
    displayInfoToast: (
        message: string,
        duration: number,
        bootstrapClasses?: string
    ) => void;
    displayWarningToast: (
        message: string,
        duration: number,
        bootstrapClasses?: string
    ) => void;
    deleteToast: (id: string) => void;
    deleteAllToasts: () => void;
    deleteAllSuccessToasts: () => void;
    deleteAllErrorToasts: () => void;
    deleteAllInfoToasts: () => void;
    deleteAllWarningToasts: () => void;
    deleteLastToast: () => void;
    deleteLastSuccessToast: () => void;
    deleteLastErrorToast: () => void;
    deleteLastInfoToast: () => void;
    deleteLastWarningToast: () => void;
}

export const defaultToastInfo: ToastInfo = {
    toastList: [],
    displaySuccessToast: (message: string, duration: number) => null,
    displayErrorToast: (message: string, duration: number) => null,
    displayInfoToast: (message: string, duration: number) => null,
    displayWarningToast: (message: string, duration: number) => null,
    deleteToast: (toast: string) => null,
    deleteAllToasts: () => null,
    deleteAllSuccessToasts: () => null,
    deleteAllErrorToasts: () => null,
    deleteAllInfoToasts: () => null,
    deleteAllWarningToasts: () => null,
    deleteLastToast: () => null,
    deleteLastSuccessToast: () => null,
    deleteLastErrorToast: () => null,
    deleteLastInfoToast: () => null,
    deleteLastWarningToast: () => null,
};
