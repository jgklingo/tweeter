import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
    public constructor(view: UserItemView) {
        super(view);
    }

    protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowees(
            authToken,
            userAlias,
            PAGE_SIZE,
            this.lastItem
        );
    }

    protected getItemDescription(): string {
        return "load followees";
    }
}
