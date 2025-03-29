import { UserImageDao } from "../interface/UserImageDao";
import { S3UserImageDao } from "../s3/S3UserImageDao";
import { AbstractDaoFactory } from "./AbstractDaoFactory";

export class AWSDaoFactory implements AbstractDaoFactory {
    public getUserImageDao() {
        return new S3UserImageDao();
    }
}
