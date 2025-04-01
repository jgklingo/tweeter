import { FollowsDao } from "../interface/FollowsDao";
import { SessionsDao } from "../interface/SessionsDao";
import { UserImageDao } from "../interface/UserImageDao";
import { UsersDao } from "../interface/UsersDao";

export interface AbstractDaoFactory {
    getUserImageDao: () => UserImageDao;
    getUsersDao: () => UsersDao;
    getSessionsDao: () => SessionsDao;
    getFollowsDao: () => FollowsDao;
}
