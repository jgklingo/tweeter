import { ItemActionRequest, PrimitiveResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: ItemActionRequest<UserDto>): Promise<PrimitiveResponse<number>> => {
    const followService = new FollowService();
    const followerCount = await followService.getFollowerCount(request.token, request.item);

    return {
        success: true,
        message: null,
        primitive: followerCount
    }
}
