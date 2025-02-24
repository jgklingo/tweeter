import { User } from "tweeter-shared";
import { ErrorView } from "./Presenter";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends ErrorView {
    addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    protected createService(): FollowService {
        return new FollowService();
    }
}
