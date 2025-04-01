import { DynamoDBFollowsDao } from "../aws/DynamoDBFollowsDao";
import { DynamoDBSessionsDao } from "../aws/DynamoDBSessionsDao";
import { DynamoDBUsersDao } from "../aws/DynamoDBUsersDao";
import { S3UserImageDao } from "../aws/S3UserImageDao";
import { FollowsDao } from "../interface/FollowsDao";
import { UsersDao } from "../interface/UsersDao";
import { AbstractDaoFactory } from "./AbstractDaoFactory";

export class AWSDaoFactory implements AbstractDaoFactory {
    public getUserImageDao() {
        return new S3UserImageDao();
    }

    public getUsersDao() {
        return new DynamoDBUsersDao();
    }

    public getSessionsDao() {
        return new DynamoDBSessionsDao();
    }

    public getFollowsDao() {
        return new DynamoDBFollowsDao();
    }
}
