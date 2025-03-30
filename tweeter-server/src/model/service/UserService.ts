import { AuthToken, FakeData, User } from "tweeter-shared";
import { hash, compare } from "bcryptjs";
import { AbstractDaoFactory } from "../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../dao/factory/AWSDaoFactory";
import { UserImageDao } from "../dao/interface/UserImageDao";
import { UsersDao } from "../dao/interface/UsersDao";
import { SessionsDao } from "../dao/interface/SessionsDao";

export class UserService {
    private readonly AUTH_TOKEN_LIFETIME = 8640000;

    private daoFactory: AbstractDaoFactory = new AWSDaoFactory();
    private userImageDao: UserImageDao = this.daoFactory.getUserImageDao();
    private usersDao: UsersDao = this.daoFactory.getUsersDao();
    private sessionsDao: SessionsDao = this.daoFactory.getSessionsDao();

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

        const userImageUrl = await this.userImageDao.insert(`${alias}.${imageFileExtension}`, imageStringBase64);

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
        await this.checkToken(token);
        const [user] = await this.checkUser(alias);
        return user;
    };

    public async checkToken(token: string) {
        const result = await this.sessionsDao.getByToken(token);
        if (result == null) {
            throw new Error("[Bad Request] Token not found");
        }
        const [authToken] = result;
        if (authToken.timestamp < Date.now() - this.AUTH_TOKEN_LIFETIME) {
            throw new Error("[Bad Request] Token expired");
        }
        await this.sessionsDao.update(token, Date.now());
    }

    private async checkUser(alias: string) {
        const result = await this.usersDao.getByHandle(alias);
        if (result == null) {
            throw new Error("[Bad Request] User not found");
        }
        return result;
    }
}
