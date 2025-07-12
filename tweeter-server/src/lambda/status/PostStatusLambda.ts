import { ItemActionRequest, StatusDto, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: ItemActionRequest<StatusDto>): Promise<TweeterResponse> => {
    const statusService = new StatusService();
    await statusService.postStatus(request.token, request.item)

    return {
        success: true,
        message: null
    }
}
