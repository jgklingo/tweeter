import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: (to: string) => void | Promise<void>,
    displayErrorMessage: (message: string) => void,
    setIsLoading: (value: boolean) => void
}

export class LoginPresenter {
    private userService: UserService;
    private view: LoginView;

    public constructor(view: LoginView) {
        this.userService = new UserService();
        this.view = view;
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    };

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.userService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this.view.setIsLoading(false);
        }
    };
}
