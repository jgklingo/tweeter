import {
    ItemActionRequest,
    PagedItemRequest,
    PagedItemResponse,
    User,
    PrimitiveResponse,
    UserDto,
    IsFollowerRequest,
    StatusDto,
    Status,
    TweeterResponse,
    TweeterRequest,
    GetUserResponse,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    AuthToken,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL = "https://1pdzqert3k.execute-api.us-east-1.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async getMoreFollowees(
        request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedItemRequest<UserDto>,
            PagedItemResponse<UserDto>
        >(request, "/followee/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        let items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        this.handleResponseError(response);
        items = this.handleNoDataError(items, "followees");
        return [items, response.hasMore];
    }

    public async getMoreFollowers(
        request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedItemRequest<UserDto>,
            PagedItemResponse<UserDto>
        >(request, "/follower/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        let items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        this.handleResponseError(response);
        items = this.handleNoDataError(items, "followers");
        return [items, response.hasMore];
    }

    public async follow(request: ItemActionRequest<UserDto>): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<[followerCount: number, followeeCount: number]>>(request, "/follow");

        this.handleResponseError(response);
        return response.primitive;
    }

    public async unfollow(request: ItemActionRequest<UserDto>): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<[followerCount: number, followeeCount: number]>>(request, "/unfollow");

        this.handleResponseError(response);
        return response.primitive;
    }

    public async getFolloweeCount(request: ItemActionRequest<UserDto>): Promise<number> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<number>>(request, "/followee/count");

        this.handleResponseError(response);
        return response.primitive;
    }

    public async getFollowerCount(request: ItemActionRequest<UserDto>): Promise<number> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<number>>(request, "/follower/count");

        this.handleResponseError(response);
        return response.primitive;
    }

    public async getIsFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<IsFollowerRequest, PrimitiveResponse<boolean>>(request, "/follower/isfollower");

        this.handleResponseError(response);
        return response.primitive;
    }

    public async getMoreFeedItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDto>, PagedItemResponse<StatusDto>>(request, "/feed/list");

        let items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        this.handleResponseError(response);
        items = this.handleNoDataError(items, "feed items");
        return [items, response.hasMore];
    }

    public async getMoreStoryItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDto>, PagedItemResponse<StatusDto>>(request, "/story/list");

        let items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        this.handleResponseError(response);
        items = this.handleNoDataError(items, "story items");
        return [items, response.hasMore];

    }

    public async postStatus(request: ItemActionRequest<StatusDto>): Promise<void> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<StatusDto>, TweeterResponse>(request, "/poststatus");

        this.handleResponseError(response);
        return;
    }

    public async logout(request: TweeterRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(request, "/logout");

        this.handleResponseError(response);
        return;
    }

    public async getUser(request: ItemActionRequest<string>): Promise<User | null> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<string>, GetUserResponse>(request, "/getuser");

        const user = response.user == null ? null : User.fromDto(response.user);

        this.handleResponseError(response);
        return user;
    }

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(request, "/login");

        this.handleResponseError(response);
        return [User.fromDto(response.user)!, new AuthToken(response.token, 0)]; // TODO: check this line
    }

    public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<LoginRequest, LoginResponse>(request, "/register");

        this.handleResponseError(response);
        return [User.fromDto(response.user)!, new AuthToken(response.token, 0)]; // TODO: check this line
    }

    private handleResponseError(response: TweeterResponse) {
        if (!response.success) {
            console.error(response);
            let message: string;
            if (response.message !== null) {
                message = response.message;
            } else {
                message = "No error message returned."
            }
            throw new Error(message);
        }
    }

    private handleNoDataError<T>(items: Array<T> | null, itemDescription: string): Array<T> {
        if (items == null) {
            throw new Error(`No ${itemDescription} found`);
        } else {
            return items;
        }
    }
}
