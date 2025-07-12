import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserNavigationHookPresenter, UserNavigationHookView } from "../../presenters/UserNavigationHookPresenter";
import { useState } from "react";

interface UserNavigationHook {
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useNavigateToUser = (): UserNavigationHook => {
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(event.target.toString(), authToken!, currentUser!);
    };

    const listener: UserNavigationHookView = {
        setDisplayedUser: setDisplayedUser,
        displayErrorMessage: displayErrorMessage
    }

    const [presenter] = useState(new UserNavigationHookPresenter(listener))

    return {
        navigateToUser: navigateToUser,
    };
};

export default useNavigateToUser;
