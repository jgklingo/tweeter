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

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        // TODO: Post the status
        return;
    };

    private async getFakeData(lastItem: StatusDto | null, limit: number): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), limit);
        const dtos = items.map((status: Status) => status.dto);
        return [dtos, hasMore];
    }
}
