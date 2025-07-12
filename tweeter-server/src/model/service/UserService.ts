import { AuthToken, User } from "tweeter-shared";
import { hash, compare } from "bcryptjs";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { UserImageDao } from "../dao/interface/UserImageDao";
import { UsersDao } from "../dao/interface/UsersDao";
import { SessionsDao } from "../dao/interface/SessionsDao";
import { AuthenticationHelper } from "./helper/AuthenticationHelper";

export class UserService {
    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private userImageDao: UserImageDao = this.daoFactory.getUserImageDao();
    private usersDao: UsersDao = this.daoFactory.getUsersDao();
    private sessionsDao: SessionsDao = this.daoFactory.getSessionsDao();

    private authenticationHelper: AuthenticationHelper = new AuthenticationHelper(this.daoFactory);

    public async logout(token: string): Promise<void> {
        await this.sessionsDao.delete(token);
    };

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const [user, hashedPassword] = await this.checkUser(alias);
        if (!await compare(password, hashedPassword)) {
            throw new Error("[Bad Request] Password incorrect");
        }

        const authToken = AuthToken.Generate();
        await this.sessionsDao.insert(authToken, alias);

        return [user, authToken];
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageStringBase64: string,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // TODO: check if user already exists?

        const imageFileName = `${alias.split('@')[1]}_${Date.now()}.${imageFileExtension}`
        const userImageUrl = await this.userImageDao.insert(imageFileName, imageStringBase64);

        const user = new User(firstName, lastName, alias, userImageUrl);
        const hashedPassword = await hash(password, 10);
        await this.usersDao.insert(user, hashedPassword);

        const authToken = AuthToken.Generate();
        await this.sessionsDao.insert(authToken, alias);

        return [user, authToken];
    };

    public async getUser(
        token: string,
        alias: string
    ): Promise<User | null> {
        await this.authenticationHelper.checkToken(token);
        const [user] = await this.checkUser(alias);
        return user;
    };

    private async checkUser(alias: string) {
        const result = await this.usersDao.getByHandle(alias);
        if (result == null) {
            throw new Error("[Bad Request] User not found");
        }
        return result;
    }
}
