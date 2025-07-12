import { User, AuthToken } from "tweeter-shared";
import { ErrorView, ErrorPresenter } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthenticationView extends ErrorView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    navigate: (to: string) => void | Promise<void>,
    setIsLoading: (value: boolean) => void
}

export abstract class AuthenticationPresenter<V extends AuthenticationView> extends ErrorPresenter<V> {
    protected userService: UserService;

    protected constructor(view: V) {
        super(view);
        this.userService = new UserService();
    }

    public doAuthentication(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl?: string) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await this.getUserAuthToken(firstName, lastName, alias, password);

                this.view.updateUserInfo(user, user, authToken, rememberMe);

                if (!!originalUrl) {
                    this.view.navigate(originalUrl);
                } else {
                    this.view.navigate("/");
                }
            },
            this.getOperationDescription(),
            () => {
                this.view.setIsLoading(false);
            }
        );
    }

    protected abstract getOperationDescription(): string;

    protected abstract getUserAuthToken(firstName: string, lastName: string, alias: string, password: string): Promise<[User, AuthToken]>;
}
