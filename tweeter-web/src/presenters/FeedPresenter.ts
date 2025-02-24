import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
    public constructor(view: StatusItemView) {
        super(view);
    }

    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getItemDescription(): string {
        return "load feed items";
    }
}
