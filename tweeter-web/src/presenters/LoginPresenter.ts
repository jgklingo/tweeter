import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: (to: string) => void | Promise<void>,
    setIsLoading: (value: boolean) => void
}

export class LoginPresenter extends Presenter<LoginView> {
    private userService: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.userService = new UserService();
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    };

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await this.userService.login(alias, password);

                this.view.updateUserInfo(user, user, authToken, rememberMe);

                if (!!originalUrl) {
                    this.view.navigate(originalUrl);
                } else {
                    this.view.navigate("/");
                }
            },
            "log user in",
            () => {
                this.view.setIsLoading(false);
            }
        );
    };
}
