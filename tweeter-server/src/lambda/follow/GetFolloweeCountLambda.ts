import { ItemActionRequest, PrimitiveResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: ItemActionRequest<UserDto>): Promise<PrimitiveResponse<number>> => {
    const followService = new FollowService();
    const followeeCount = await followService.getFolloweeCount(request.token, request.item);

    return {
        success: true,
        message: null,
        primitive: followeeCount
    }
}
