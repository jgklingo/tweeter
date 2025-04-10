import { Status, StatusDto } from "tweeter-shared";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { FollowsDao } from "../dao/interface/FollowsDao";
import { StatusDao } from "../dao/interface/StatusDao";
import { AuthenticationHelper } from "./helper/AuthenticationHelper";
import { SQSQueueHelper } from "./helper/SQSQueueHelper";

export class StatusService {
    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private statusDao: StatusDao = this.daoFactory.getStatusDao();
    private followsDao: FollowsDao = this.daoFactory.getFollowsDao();

    private authenticationHelper: AuthenticationHelper = new AuthenticationHelper(this.daoFactory);
    private sqsQueueHelper: SQSQueueHelper = new SQSQueueHelper();

    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.authenticationHelper.checkToken(token);
        const [feedItems, hasMore] = await this.statusDao.getPageOfFeedItems(userAlias, pageSize, lastItem?.timestamp);
        return [feedItems, hasMore];
    };

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.authenticationHelper.checkToken(token);
        const [storyItems, hasMore] = await this.statusDao.getPageOfStoryItems(userAlias, pageSize, lastItem?.timestamp);
        return [storyItems, hasMore];
    };

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        const [, userHandle] = await this.authenticationHelper.checkToken(token);
        await this.statusDao.insertStoryItem(userHandle, Status.fromDto(newStatus)!);

        await this.sqsQueueHelper.queueStatus(userHandle, newStatus);
    };
}
