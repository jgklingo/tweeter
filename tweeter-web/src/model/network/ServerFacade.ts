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
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
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

    public async getMoreFollowers(
        request: PagedItemRequest<UserDto>
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedItemRequest<UserDto>,
            PagedItemResponse<UserDto>
        >(request, "/follower/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No followers found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
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

    public async follow(request: ItemActionRequest<UserDto>): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<[followerCount: number, followeeCount: number]>>(request, "/follow");

        // Handle errors    
        if (response.success) {
            return response.primitive;
        } else {
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

    public async unfollow(request: ItemActionRequest<UserDto>): Promise<[followerCount: number, followeeCount: number]> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<[followerCount: number, followeeCount: number]>>(request, "/unfollow");

        // Handle errors    
        if (response.success) {
            return response.primitive;
        } else {
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

    public async getFolloweeCount(request: ItemActionRequest<UserDto>): Promise<number> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<number>>(request, "/followee/count");

        // Handle errors    
        if (response.success) {
            return response.primitive;
        } else {
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

    public async getFollowerCount(request: ItemActionRequest<UserDto>): Promise<number> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<UserDto>, PrimitiveResponse<number>>(request, "/follower/count");

        // Handle errors    
        if (response.success) {
            return response.primitive;
        } else {
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

    public async getIsFollowerStatus(request: IsFollowerRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<IsFollowerRequest, PrimitiveResponse<boolean>>(request, "/follower/isfollower");

        // Handle errors    
        if (response.success) {
            return response.primitive;
        } else {
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

    public async getMoreFeedItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDto>, PagedItemResponse<StatusDto>>(request, "/feed/list");

        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No feed items found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
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

    public async getMoreStoryItems(request: PagedItemRequest<StatusDto>): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<PagedItemRequest<StatusDto>, PagedItemResponse<StatusDto>>(request, "/story/list");

        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No story items found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
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

    public async postStatus(request: ItemActionRequest<StatusDto>): Promise<void> {
        const response = await this.clientCommunicator.doPost<ItemActionRequest<StatusDto>, TweeterResponse>(request, "/poststatus");

        // Handle errors    
        if (response.success) {
            return;
        } else {
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

    public async logout(request: TweeterRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(request, "/logout");

        // Handle errors    
        if (response.success) {
            return;
        } else {
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
}
