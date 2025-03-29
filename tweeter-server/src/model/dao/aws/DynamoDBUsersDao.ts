import { PutCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UsersDao } from "../interface/UsersDao";
import { User } from "tweeter-shared";

export class DynamoDBUsersDao implements UsersDao {
    readonly tableName = "users";
    readonly handleAttr = "handle";
    readonly userDtoAttr = "user_dto";
    readonly hashedPasswordAttr = "hashed_password";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async insert(user: User, hashedPassword: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.handleAttr]: user.alias,
                [this.userDtoAttr]: user.dto,
                [this.hashedPasswordAttr]: hashedPassword
            }
        };
        await this.client.send(new PutCommand(params));
    }

    public async getByHandle(handle: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.handleAttr]: handle
            }
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item == undefined) {
            return null;
        }
        const user = User.fromDto(output.Item[this.userDtoAttr]);
        const hashedPassword = output.Item[this.hashedPasswordAttr];
        return [user, hashedPassword] as [User, string];
    }
}
