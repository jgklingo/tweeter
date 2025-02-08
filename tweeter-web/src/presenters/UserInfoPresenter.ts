import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
    displayInfoMessage: (message: string, duration: number) => void,
    displayErrorMessage: (message: string) => void,
    clearLastInfoMessage: () => void,
    setIsFollower: (value: boolean) => void,
    setFolloweeCount: (value: number) => void,
    setFollowerCount: (value: number) => void,
    setDisplayedUser: (value: User) => void,
    setIsLoading: (value: boolean) => void
}

export class UserInfoPresenter {
    private userService: UserService
    private view: UserInfoView;

    public constructor(view: UserInfoView) {
        this.userService = new UserService();
        this.view = view;
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.userService.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to determine follower status because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followees count because of exception: ${error}`
            );
        }
    };

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User
    ) {
        try {
            this.view.setFollowerCount(await this.userService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get followers count because of exception: ${error}`
            );
        }
    };

    public switchToLoggedInUser(currentUser: User): void {
        this.view.setDisplayedUser(currentUser);
    };

    public async followDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        try {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

            const [followerCount, followeeCount] = await this.userService.follow(
                authToken!,
                displayedUser!
            );

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to follow user because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
        }
    };

    public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken): Promise<void> {
        try {
            this.view.setIsLoading(true);
            this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

            const [followerCount, followeeCount] = await this.userService.unfollow(
                authToken,
                displayedUser
            );

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to unfollow user because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            this.view.setIsLoading(false);
        }
    };
}
