import { UserDto, Follow } from "tweeter-shared";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { UsersDao } from "../dao/interface/UsersDao";
import { Authenticator } from "./Authenticator";
import { FollowsDao } from "../dao/interface/FollowsDao";

export class FollowService {
    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private usersDao: UsersDao = this.daoFactory.getUsersDao();
    private followsDao: FollowsDao = this.daoFactory.getFollowsDao();

    private authenticator: Authenticator = new Authenticator(this.daoFactory);

    public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.authenticator.checkToken(token);
        const [followers, hasMore] = await this.followsDao.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);

        const followerHandles = followers.map(follower => follower.followerHandle);
        const users = followerHandles.length > 0 ? await this.usersDao.getBatch(followerHandles) : [];
        const userDtos = users.map(user => user.dto);

        return [userDtos, hasMore] as [UserDto[], boolean];
    };

    public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
        await this.authenticator.checkToken(token);
        const [followees, hasMore] = await this.followsDao.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);

        const followeeHandles = followees.map(followee => followee.followeeHandle);
        const users = followeeHandles.length > 0 ? await this.usersDao.getBatch(followeeHandles) : [];
        const userDtos = users.map(user => user.dto);

        return [userDtos, hasMore] as [UserDto[], boolean];
    };

    public async unfollow(
        token: string,
        userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const [, userHandle] = await this.authenticator.checkToken(token);
        await this.followsDao.delete(new Follow(userHandle, userToUnfollow.alias));

        const followerCount = (await this.followsDao.getAllFollowers(userToUnfollow.alias)).length;
        const followeeCount = (await this.followsDao.getAllFollowees(userToUnfollow.alias)).length;

        return [followerCount, followeeCount];
    };

    public async follow(
        token: string,
        userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
        const [, userHandle] = await this.authenticator.checkToken(token);
        await this.followsDao.insert(new Follow(userHandle, userToFollow.alias));

        const followerCount = (await this.followsDao.getAllFollowers(userToFollow.alias)).length;
        const followeeCount = (await this.followsDao.getAllFollowees(userToFollow.alias)).length;

        return [followerCount, followeeCount];
    };

    public async getFollowerCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.authenticator.checkToken(token);
        return (await this.followsDao.getAllFollowers(user.alias)).length;
    };

    public async getFolloweeCount(
        token: string,
        user: UserDto
    ): Promise<number> {
        await this.authenticator.checkToken(token);
        return (await this.followsDao.getAllFollowees(user.alias)).length;
    };

    public async getIsFollowerStatus(
        token: string,
        user: UserDto,
        selectedUser: UserDto
    ): Promise<boolean> {
        await this.authenticator.checkToken(token);
        const follow = await this.followsDao.find(new Follow(user.alias, selectedUser.alias));
        return follow !== null;
    };
}
