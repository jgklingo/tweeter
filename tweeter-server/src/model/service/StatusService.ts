import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";

export class StatusService {
    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    };

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    };

    // public async postStatus(
    //     authToken: AuthToken,
    //     newStatus: Status
    // ): Promise<void> {
    //     // Pause so we can see the posting status message. Remove when connected to the server
    //     await new Promise((f) => setTimeout(f, 2000));

    //     // TODO: Call the server to post the status
    // };

    private async getFakeData(lastItem: StatusDto | null, limit: number): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), limit);
        const dtos = items.map((status: Status) => status.dto);
        return [dtos, hasMore];
    }
}
