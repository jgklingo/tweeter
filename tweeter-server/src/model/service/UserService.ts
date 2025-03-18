import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
    public async logout(token: string): Promise<void> {
        // TODO: Log out
        return;
    };

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, FakeData.instance.authToken];
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        const userImageBytes: Uint8Array = Buffer.from(imageStringBase64, "base64");

        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, FakeData.instance.authToken];
    };

    public async getUser(
        token: string,
        alias: string
    ): Promise<User | null> {
        return FakeData.instance.findUserByAlias(alias);
    };
}
