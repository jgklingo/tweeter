import { GetUserResponse, ItemActionRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: ItemActionRequest<string>): Promise<GetUserResponse> => {
    const userService = new UserService();
    const user = await userService.getUser(request.token, request.item)

    return {
        success: true,
        message: null,
        user: user
    }
}
