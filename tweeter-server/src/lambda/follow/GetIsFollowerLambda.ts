import { IsFollowerRequest, PrimitiveResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: IsFollowerRequest): Promise<PrimitiveResponse<boolean>> => {
    const followService = new FollowService();
    const isFollower = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser);

    return {
        success: true,
        message: null,
        primitive: isFollower
    }
}