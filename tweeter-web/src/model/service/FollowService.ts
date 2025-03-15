import { AuthToken, User, FakeData, PagedItemRequest, UserDto, ItemActionRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService {
    private serverFacade = new ServerFacade();

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const request: PagedItemRequest<UserDto> = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem?.dto || null
        }
        return this.serverFacade.getMoreFollowers(request);
    };

    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const request: PagedItemRequest<UserDto> = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem?.dto || null
        }
        return this.serverFacade.getMoreFollowees(request);
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        const request: ItemActionRequest<UserDto> = {
            token: authToken.token,
            item: userToUnfollow.dto
        }
        return this.serverFacade.unfollow(request);
    };

    public async follow(
        authToken: AuthToken,
        userToFollow: User
    ): Promise<[followerCount: number, followeeCount: number]> {
        const request: ItemActionRequest<UserDto> = {
            token: authToken.token,
            item: userToFollow.dto
        }
        return this.serverFacade.follow(request);
    };

    public async getFollowerCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(user.alias);
    };

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User
    ): Promise<number> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getFolloweeCount(user.alias);
    };

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
    ): Promise<boolean> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.isFollower();
    };
}
