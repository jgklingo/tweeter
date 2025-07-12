import { ItemActionRequest, PrimitiveResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: ItemActionRequest<UserDto>): Promise<PrimitiveResponse<[followerCount: number, followeeCount: number]>> => {
    const followService = new FollowService();
    const countTuple = await followService.follow(request.token, request.item)

    return {
        success: true,
        message: null,
        primitive: countTuple
    }
}
