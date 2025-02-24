import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { FollowService } from "../model/service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (value: boolean) => void,
    setFolloweeCount: (value: number) => void,
    setFollowerCount: (value: number) => void,
    setDisplayedUser: (value: User) => void,
    setIsLoading: (value: boolean) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService: FollowService;

    public constructor(view: UserInfoView) {
        super(view);
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(
            async () => {
                if (currentUser === displayedUser) {
                    this.view.setIsFollower(false);
                } else {
                    this.view.setIsFollower(
                        await this.followService.getIsFollowerStatus(
                            authToken!,
                            currentUser!,
                            displayedUser!
                        )
                    );
                }
            },
            "determine follower status"
        );
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
            },
            "get followees count"
        );
    };

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
            },
            "get followers count"
        );
    };

    public switchToLoggedInUser(currentUser: User): void {
        this.view.setDisplayedUser(currentUser);
    };

    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);
                this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

                const [followerCount, followeeCount] = await this.followService.follow(
                    authToken!,
                    displayedUser!
                );

                this.view.setIsFollower(true);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            "follow user",
            () => {
                this.view.clearLastInfoMessage();
                this.view.setIsLoading(false);
            }
        );
    };

    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);
                this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

                const [followerCount, followeeCount] = await this.followService.unfollow(
                    authToken,
                    displayedUser
                );

                this.view.setIsFollower(false);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            "unfollow user",
            () => {
                this.view.clearLastInfoMessage();
                this.view.setIsLoading(false);
            }
        );
    };
}
