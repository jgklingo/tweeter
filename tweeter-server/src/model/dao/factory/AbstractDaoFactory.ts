import { UserImageDao } from "../interface/UserImageDao";

export interface AbstractDaoFactory {
    getUserImageDao: () => UserImageDao;
}
