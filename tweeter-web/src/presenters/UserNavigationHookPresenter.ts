import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { ErrorView, ErrorPresenter } from "./Presenter";

export interface UserNavigationHookView extends ErrorView {
    setDisplayedUser(user: User): void;
}

export class UserNavigationHookPresenter extends ErrorPresenter<UserNavigationHookView> {
    private userService: UserService;

    public constructor(view: UserNavigationHookView) {
        super(view);
        this.userService = new UserService
    }

    public async navigateToUser(target: string, authToken: AuthToken, currentUser: User): Promise<void> {
        this.doFailureReportingOperation(
            async () => {
                const alias = this.extractAlias(target);

                const user = await this.userService.getUser(authToken, alias);

                if (!!user) {
                    if (currentUser.equals(user)) {
                        this.view.setDisplayedUser(currentUser!);
                    } else {
                        this.view.setDisplayedUser(user);
                    }
                }
            },
            "get user"
        );
    };

    public extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}
