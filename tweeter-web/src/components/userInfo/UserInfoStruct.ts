import { User, AuthToken } from "tweeter-shared";

export interface UserInfo {
    currentUser: User | null;
    displayedUser: User | null;
    authToken: AuthToken | null;
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
    ) => void;
    clearUserInfo: () => void;
    setDisplayedUser: (user: User) => void;
}

export const defaultUserInfo: UserInfo = {
    currentUser: null,
    displayedUser: null,
    authToken: null,
    updateUserInfo: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean = false
    ) => null,
    clearUserInfo: () => null,
    setDisplayedUser: (user) => null,
};
