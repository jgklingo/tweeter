import { Context, createContext, useState } from "react";
import { ToastProviderPresenter, ToastProviderView } from "../../presenters/ToastProviderPresenter";
import { ToastInfo, defaultToastInfo } from "../../model/ToastInfo";

export const ToastInfoContext: Context<ToastInfo> =
    createContext<ToastInfo>(defaultToastInfo);

interface Props {
    children: React.ReactNode;
}

const ToastProvider: React.FC<Props> = ({ children }) => {
    const [toastInfo, setToastInfo] = useState(defaultToastInfo);

    const listener: ToastProviderView = {
        setToastInfo: setToastInfo
    }

    const [presenter] = useState(new ToastProviderPresenter(listener));

    return (
        <ToastInfoContext.Provider
            value={{
                ...toastInfo,
                displaySuccessToast: presenter.displaySuccessToastGenerator(toastInfo),
                displayErrorToast: presenter.displayErrorToastGenerator(toastInfo),
                displayInfoToast: presenter.displayInfoToastGenerator(toastInfo),
                displayWarningToast: presenter.displayWarningToastGenerator(toastInfo),
                deleteToast: presenter.deleteToastGenerator(toastInfo),
                deleteAllToasts: presenter.deleteAllToastsGenerator(toastInfo),
                deleteAllSuccessToasts: presenter.deleteAllSuccessToastsGenerator(toastInfo),
                deleteAllErrorToasts: presenter.deleteAllErrorToastsGenerator(toastInfo),
                deleteAllInfoToasts: presenter.deleteAllInfoToastsGenerator(toastInfo),
                deleteAllWarningToasts: presenter.deleteAllWarningToastsGenerator(toastInfo),
                deleteLastToast: presenter.deleteLastToastGenerator(toastInfo),
                deleteLastSuccessToast: presenter.deleteLastSuccessToastGenerator(toastInfo),
                deleteLastErrorToast: presenter.deleteLastErrorToastGenerator(toastInfo),
                deleteLastInfoToast: presenter.deleteLastInfoToastGenerator(toastInfo),
                deleteLastWarningToast: presenter.deleteLastWarningToastGenerator(toastInfo),
            }}
        >
            {children}
        </ToastInfoContext.Provider>
    );
};

export default ToastProvider;
