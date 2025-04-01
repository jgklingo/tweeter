import { PutCommand, GetCommand, BatchGetCommand } from "@aws-sdk/lib-dynamodb";
import { UsersDao } from "../interface/UsersDao";
import { User } from "tweeter-shared";
import { DynamoDBClientLoader } from "./DynamoDBClientLoader";

export class DynamoDBUsersDao implements UsersDao {
    readonly tableName = "users";
    readonly handleAttr = "handle";
    readonly userDtoAttr = "user_dto";
    readonly hashedPasswordAttr = "hashed_password";

    private readonly client = DynamoDBClientLoader.getInstance().documentClient;

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

    public async getBatch(handles: string[]) {
        const keys = handles.map(handle => ({ [this.handleAttr]: handle }));
        const params = {
            RequestItems: {
                [this.tableName]: {
                    Keys: keys
                }
            }
        };
        const output = await this.client.send(new BatchGetCommand(params));

        const items: User[] = [];
        output.Responses?.[this.tableName]?.forEach((item) => {
            items.push(User.fromDto(item[this.userDtoAttr])!)
        })

        let unprocessed = output.UnprocessedKeys;
        while (unprocessed && Object.keys(unprocessed).length > 0) {
            const retryOutput = await this.client.send(new BatchGetCommand({ RequestItems: unprocessed }));
            retryOutput.Responses?.[this.tableName]?.forEach((item) => {
                items.push(User.fromDto(item[this.userDtoAttr])!)
            })
            unprocessed = retryOutput.UnprocessedKeys;
        }

        return items;
    }
}
