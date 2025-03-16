import { AuthToken, Status, FakeData, PagedItemRequest, StatusDto } from "tweeter-shared";
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
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        // Pause so we can see the posting status message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
    };
}
