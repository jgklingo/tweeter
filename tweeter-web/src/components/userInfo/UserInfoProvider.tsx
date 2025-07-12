import { Context, createContext, useEffect, useState } from "react";
import { UserInfoProviderPresenter, UserInfoProviderView } from "../../presenters/UserInfoProviderPresenter";
import { UserInfo, defaultUserInfo } from "../../model/UserInfo";

export const UserInfoContext: Context<UserInfo> =
    createContext<UserInfo>(defaultUserInfo);

interface Props {
    children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);

    const listener: UserInfoProviderView = {
        setUserInfo: setUserInfo
    }

    const [provider] = useState(new UserInfoProviderPresenter(listener));

    useEffect(() => setUserInfo({
        ...defaultUserInfo,
        ...provider.retrieveFromLocalStorage(),
    }), []);

    return (
        <UserInfoContext.Provider
            value={{
                ...userInfo,
                updateUserInfo: provider.updateUserInfoGenerator(userInfo),
                clearUserInfo: provider.clearUserInfoGenerator(userInfo),
                setDisplayedUser: provider.setDisplayedUserGenerator(userInfo),
            }}
        >
            {children}
        </UserInfoContext.Provider>
    );
};

export default UserInfoProvider;
