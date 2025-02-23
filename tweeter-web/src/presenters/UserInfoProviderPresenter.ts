import { User, AuthToken } from "tweeter-shared";
import { UserInfo, defaultUserInfo } from "../model/UserInfo";
import { Presenter, View } from "./Presenter";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

export interface UserInfoProviderView extends View {
    setUserInfo: (value: UserInfo) => void;
}

export class UserInfoProviderPresenter extends Presenter<UserInfoProviderView> {
    public constructor(view: UserInfoProviderView) {
        super(view);
    }

    public saveToLocalStorage(
        currentUser: User,
        authToken: AuthToken
    ): void {
        localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
        localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
    };

    public retrieveFromLocalStorage(): {
        currentUser: User | null;
        displayedUser: User | null;
        authToken: AuthToken | null;
    } {
        const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
        const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

        if (!!loggedInUser && !!authToken) {
            return {
                currentUser: loggedInUser,
                displayedUser: loggedInUser,
                authToken: authToken,
            };
        } else {
            return { currentUser: null, displayedUser: null, authToken: null };
        }
    };

    public clearLocalStorage(): void {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
    };

    public updateUserInfoGenerator(userInfo: UserInfo) {
        return (
            currentUser: User,
            displayedUser: User | null,
            authToken: AuthToken,
            remember: boolean
        ) => {
            this.view.setUserInfo({
                ...userInfo,
                currentUser: currentUser,
                displayedUser: displayedUser,
                authToken: authToken,
            });

            if (remember) {
                this.saveToLocalStorage(currentUser, authToken);
            }
        }
    }

    public clearUserInfoGenerator(userInfo: UserInfo) {
        return () => {
            this.view.setUserInfo({
                ...userInfo,
                currentUser: null,
                displayedUser: null,
                authToken: null,
            });
            this.clearLocalStorage();
        }
    }

    public setDisplayedUserGenerator(userInfo: UserInfo) {
        return (user: User) => {
            this.view.setUserInfo({ ...userInfo, displayedUser: user });
        }
    }

    // public updateUserInfo(
    //     currentUser: User,
    //     displayedUser: User | null,
    //     authToken: AuthToken,
    //     remember: boolean
    // ) {
    //     this.view.setUserInfo({
    //         ...this.view.getUserInfo(),
    //         currentUser: currentUser,
    //         displayedUser: displayedUser,
    //         authToken: authToken,
    //     });

    //     if (remember) {
    //         this.saveToLocalStorage(currentUser, authToken);
    //     }
    // };

    // public clearUserInfo() {
    //     this.view.setUserInfo({
    //         ...this.view.getUserInfo(),
    //         currentUser: null,
    //         displayedUser: null,
    //         authToken: null,
    //     });
    //     this.clearLocalStorage();
    // };

    // public setDisplayedUser(user: User) {
    //     this.view.setUserInfo({ ...this.view.getUserInfo(), displayedUser: user });
    // };
}
