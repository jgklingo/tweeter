import { ItemActionRequest, UserActionResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: ItemActionRequest<UserDto>): Promise<UserActionResponse> => {
    const followService = new FollowService();
    const countTuple = await followService.unfollow(request.token, request.item)

    return {
        success: true,
        message: null,
        countTuple: countTuple
    }
}
