import { User } from "tweeter-shared";
import { ErrorView } from "./Presenter";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends PagedItemView<User> { }

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
    protected createService(): FollowService {
        return new FollowService();
    }
}
