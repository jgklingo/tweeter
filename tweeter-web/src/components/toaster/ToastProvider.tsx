import { Context, createContext, useState } from "react";
import { ToastProviderPresenter, ToastProviderView } from "../../presenters/ToastProviderPresenter";
import { ToastInfo, defaultToastInfo } from "./ToastInfo";

export const ToastInfoContext: Context<ToastInfo> =
    createContext<ToastInfo>(defaultToastInfo);

interface Props {
    children: React.ReactNode;
}

const ToastProvider: React.FC<Props> = ({ children }) => {
    const [toastInfo, setToastInfo] = useState(defaultToastInfo);

    const listener: ToastProviderView = {
        setToastInfo: setToastInfo,
        getToastInfo: () => toastInfo
    }

    const [presenter] = useState(new ToastProviderPresenter(listener));

    return (
        <ToastInfoContext.Provider
            value={{
                ...toastInfo,
                displaySuccessToast: presenter.displaySuccessToast,
                displayErrorToast: presenter.displayErrorToast,
                displayInfoToast: presenter.displayInfoToast,
                displayWarningToast: presenter.displayWarningToast,
                deleteToast: presenter.deleteToast,
                deleteAllToasts: presenter.deleteAllToasts,
                deleteAllSuccessToasts: presenter.deleteAllSuccessToasts,
                deleteAllErrorToasts: presenter.deleteAllErrorToasts,
                deleteAllInfoToasts: presenter.deleteAllInfoToasts,
                deleteAllWarningToasts: presenter.deleteAllWarningToasts,
                deleteLastToast: presenter.deleteLastToast,
                deleteLastSuccessToast: presenter.deleteLastSuccessToast,
                deleteLastErrorToast: presenter.deleteLastErrorToast,
                deleteLastInfoToast: presenter.deleteLastInfoToast,
                deleteLastWarningToast: presenter.deleteLastWarningToast,
            }}
        >
            {children}
        </ToastInfoContext.Provider>
    );
};

export default ToastProvider;
