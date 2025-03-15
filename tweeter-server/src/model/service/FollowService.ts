import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";

export class FollowService {
    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
    };

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
    };

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

        return [followerCount, followeeCount];
    };

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);

        return [followerCount, followeeCount];
    };

    public async getFollowerCount(
        authToken: string,
        user: UserDto
    ): Promise<number> {
        return FakeData.instance.getFollowerCount(user.alias);
    };

    public async getFolloweeCount(
        authToken: string,
        user: UserDto
    ): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    };

    public async getIsFollowerStatus(
        authToken: string,
        user: UserDto,
        selectedUser: User
    ): Promise<boolean> {
        return FakeData.instance.isFollower();
    };

    private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string): Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user: User) => user.dto);
        return [dtos, hasMore];
    }
}
