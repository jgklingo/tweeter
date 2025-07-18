import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, ErrorPresenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    setIsLoading: (value: boolean) => void;
    setPost: (value: string) => void;
}

export class PostStatusPresenter extends ErrorPresenter<PostStatusView> {
    private _statusService: StatusService;

    public constructor(view: PostStatusView) {
        super(view);
        this._statusService = new StatusService();
    }

    public get statusService() {
        return this._statusService;
    }

    public set statusService(statusService: StatusService) {
        this._statusService = statusService;
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);
                this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, currentUser, Date.now());

                await this.statusService.postStatus(authToken, status);

                this.view.setPost("");
                this.view.displayInfoMessage("Status posted!", 2000);
            },
            "post the status",
            () => {
                this.view.clearLastInfoMessage();
                this.view.setIsLoading(false);
            }
        );
    };

    public clearPost() {
        this.view.setPost("");
    };

    public checkButtonStatus(post: string, authToken: AuthToken, currentUser: User): boolean {
        return !post.trim() || !authToken || !currentUser;
    };
}
