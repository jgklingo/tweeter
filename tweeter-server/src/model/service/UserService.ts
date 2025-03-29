import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { UserImageDao } from "../dao/interface/UserImageDao";

export class UserService {
    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private userImageDao: UserImageDao = this.daoFactory.getUserImageDao();

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
        // const userImageBytes: Uint8Array = Buffer.from(imageStringBase64, "base64"); // not needed?

        const userImageUrl = await this.userImageDao.insert(`${alias}.${imageFileExtension}`, imageStringBase64);
        console.log(userImageUrl);

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
