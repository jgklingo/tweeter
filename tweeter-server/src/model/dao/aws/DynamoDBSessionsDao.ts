import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SessionsDao } from "../interface/SessionsDao";
import { AuthToken } from "tweeter-shared";
import { DynamoDBClientLoader } from "./DynamoDBClientLoader";

export class DynamoDBSessionsDao implements SessionsDao {
    readonly tableName = "sessions";
    readonly tokenAttr = "token";
    readonly authTokenJsonAttr = "auth_token_json";
    readonly handleAttr = "handle";

    private readonly client = DynamoDBClientLoader.getInstance().documentClient;

    public async insert(authToken: AuthToken, userHandle: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.tokenAttr]: authToken.token,
                [this.authTokenJsonAttr]: authToken.toJson(),
                [this.handleAttr]: userHandle
            }
        };
        await this.client.send(new PutCommand(params));
    }

    public async getByToken(token: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAttr]: token
            }
        };
        const output = await this.client.send(new GetCommand(params));
        if (output.Item == undefined) {
            return null;
        }
        const authToken = AuthToken.fromJson(output.Item[this.authTokenJsonAttr]);
        const userHandle = output.Item[this.handleAttr];
        return [authToken, userHandle] as [AuthToken, string];
    }

    public async delete(token: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAttr]: token
            }
        };
        await this.client.send(new DeleteCommand(params));
    }

    public async update(token: string, timestamp: number) {
        const authToken = new AuthToken(token, timestamp);
        const params = {
            TableName: this.tableName,
            Key: {
                [this.tokenAttr]: token
            },
            UpdateExpression: "SET #authTokenJson = :authTokenJson",
            ExpressionAttributeNames: {
                "#authTokenJson": this.authTokenJsonAttr
            },
            ExpressionAttributeValues: {
                ":authTokenJson": authToken.toJson()
            }
        };
        await this.client.send(new UpdateCommand(params));
    }
}