import { AbstractDaoFactory } from "../../dao/factory/AbstractDaoFactory";
import { AWSDaoFactory } from "../../dao/factory/AWSDaoFactory";
import { SessionsDao } from "../../dao/interface/SessionsDao";

export class AuthenticationHelper {
    private readonly AUTH_TOKEN_LIFETIME = 8640000;

    private daoFactory: AbstractDaoFactory;
    private sessionsDao: SessionsDao;

    public constructor(daoFactory: AbstractDaoFactory) {
        this.daoFactory = daoFactory;
        this.sessionsDao = this.daoFactory.getSessionsDao();
    }

    public async checkToken(token: string) {
        const result = await this.sessionsDao.getByToken(token);
        if (result == null) {
            throw new Error("[Bad Request] Token not found");
        }
        const [authToken] = result;
        if (authToken.timestamp < Date.now() - this.AUTH_TOKEN_LIFETIME) {
            this.sessionsDao.delete(authToken.token);
            throw new Error("[Bad Request] Token expired");
        }
        await this.sessionsDao.update(token, Date.now());
        return result;
    }
}
