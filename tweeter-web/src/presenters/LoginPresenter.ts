import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";

export interface LoginView extends AuthenticationView { }

export class LoginPresenter extends AuthenticationPresenter<LoginView> {
    public constructor(view: LoginView) {
        super(view);
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    };

    protected getOperationDescription(): string {
        return "log user in";
    };

    protected getUserAuthToken(firstName: string, lastName: string, alias: string, password: string): Promise<[User, AuthToken]> {
        return this.userService.login(alias, password);
    };
}
