import { Status, StatusDto, FakeData } from "tweeter-shared";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { FollowsDao } from "../dao/interface/FollowsDao";
import { StatusDao } from "../dao/interface/StatusDao";
import { Authenticator } from "./Authenticator";

export class StatusService {
    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private statusDao: StatusDao = this.daoFactory.getStatusDao();
    private followsDao: FollowsDao = this.daoFactory.getFollowsDao();

    private authenticator: Authenticator = new Authenticator(this.daoFactory);

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.authenticator.checkToken(token);
        const [feedItems, hasMore] = await this.statusDao.getPageOfFeedItems(userAlias, pageSize, lastItem?.timestamp);
        return [feedItems, hasMore];
    };

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.authenticator.checkToken(token);
        const [storyItems, hasMore] = await this.statusDao.getPageOfStoryItems(userAlias, pageSize, lastItem?.timestamp);
        return [storyItems, hasMore];
    };

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        const [, userHandle] = await this.authenticator.checkToken(token);
        await this.statusDao.insertStoryItem(userHandle, Status.fromDto(newStatus)!);
        const followerHandles = (await this.followsDao.getAllFollowers(userHandle)).map(follow => follow.followerHandle);
        followerHandles.forEach(async followerHandle => {
            await this.statusDao.insertFeedItem(followerHandle, Status.fromDto(newStatus)!); // batch write command for feed items?
        });
    };

    private async getFakeData(lastItem: StatusDto | null, limit: number): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), limit);
        const dtos = items.map((status: Status) => status.dto);
        return [dtos, hasMore];
    }
}
