import { AuthToken, Status, FakeData, PagedItemRequest, StatusDto, ItemActionRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
    private serverFacade = new ServerFacade();

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const request: PagedItemRequest<StatusDto> = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem?.dto || null
        }
        return this.serverFacade.getMoreFeedItems(request);
    };

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const request: PagedItemRequest<StatusDto> = {
            token: authToken.token,
            userAlias: userAlias,
            pageSize: pageSize,
            lastItem: lastItem?.dto || null
        }
        return this.serverFacade.getMoreStoryItems(request);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        const request: ItemActionRequest<StatusDto> = {
            token: authToken.token,
            item: newStatus.dto
        }
        return this.serverFacade.postStatus(request);
    };
}
