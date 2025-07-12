import { AuthToken, ItemActionRequest, LoginRequest, RegisterRequest, TweeterRequest, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../network/ServerFacade";

export class UserService {
    private serverFacade = new ServerFacade();

    public async logout(authToken: AuthToken): Promise<void> {
        const request: TweeterRequest = {
            token: authToken.token
        }
        return this.serverFacade.logout(request);
    };

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const request: LoginRequest = {
            token: "",
            alias: alias,
            password: password
        }
        return this.serverFacade.login(request);
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");
        const request: RegisterRequest = {
            token: "",
            alias: alias,
            password: password,
            firstName: firstName,
            lastName: lastName,
            imageStringBase64: imageStringBase64,
            imageFileExtension: imageFileExtension
        }
        return this.serverFacade.register(request);
    };

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        const request: ItemActionRequest<string> = {
            token: authToken.token,
            item: alias
        }
        return this.serverFacade.getUser(request);
    };
}
