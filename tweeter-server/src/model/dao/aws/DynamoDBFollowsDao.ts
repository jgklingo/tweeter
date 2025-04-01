import { PutCommand, GetCommand, DeleteCommand, QueryCommand, QueryCommandOutput } from "@aws-sdk/lib-dynamodb";
import { Follow } from "tweeter-shared";
import { FollowsDao } from "../interface/FollowsDao";
import { DynamoDBClientLoader } from "./DynamoDBClientLoader";

export class DynamoDBFollowsDao implements FollowsDao {
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly followerHandleAttr = "follower_handle";
    readonly followeeHandleAttr = "followee_handle";

    private readonly client = DynamoDBClientLoader.getInstance().documentClient;

    public async insert(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.followerHandleAttr]: follow.followerHandle,
                [this.followeeHandleAttr]: follow.followeeHandle
            }
        };
        await this.client.send(new PutCommand(params));
    }

    public async getPageOfFollowers(
        followeeHandle: string,
        pageSize: number,
        lastFollowerHandle: string | undefined = undefined
    ): Promise<[Follow[], boolean]> {
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFollowerHandle === undefined
                    ? undefined
                    : {
                        [this.followerHandleAttr]: lastFollowerHandle,
                        [this.followeeHandleAttr]: followeeHandle
                    }
        };

        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        const items: Follow[] = this.queryToFollows(data);

        return [items, hasMorePages] as [Follow[], boolean];
    }

    public async getPageOfFollowees(
        followerHandle: string,
        pageSize: number,
        lastFolloweeHandle: string | undefined = undefined
    ): Promise<[Follow[], boolean]> {
        const params = {
            KeyConditionExpression: this.followerHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": followerHandle,
            },
            TableName: this.tableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastFolloweeHandle === undefined
                    ? undefined
                    : {
                        [this.followerHandleAttr]: followerHandle,
                        [this.followeeHandleAttr]: lastFolloweeHandle,
                    }
        };

        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        const items: Follow[] = this.queryToFollows(data);

        return [items, hasMorePages] as [Follow[], boolean];
    }

    public async getAllFollowers(followeeHandle: string): Promise<Follow[]> {
        const params = {
            KeyConditionExpression: this.followeeHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": followeeHandle,
            },
            TableName: this.tableName,
            IndexName: this.indexName,
        };

        const data = await this.client.send(new QueryCommand(params));
        const items: Follow[] = this.queryToFollows(data);

        return items;
    }

    public async getAllFollowees(followerHandle: string): Promise<Follow[]> {
        const params = {
            KeyConditionExpression: this.followerHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": followerHandle,
            },
            TableName: this.tableName
        };

        const data = await this.client.send(new QueryCommand(params));
        const items: Follow[] = this.queryToFollows(data);

        return items;
    }

    public async find(follow: Follow): Promise<Follow | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerHandleAttr]: follow.followerHandle,
                [this.followeeHandleAttr]: follow.followeeHandle
            }
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined ? null : new Follow(
            output.Item[this.followerHandleAttr],
            output.Item[this.followeeHandleAttr]
        )
    }

    public async delete(follow: Follow): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.followerHandleAttr]: follow.followerHandle,
                [this.followeeHandleAttr]: follow.followeeHandle
            }
        };
        await this.client.send(new DeleteCommand(params));
    }

    private queryToFollows(data: QueryCommandOutput) {
        const items: Follow[] = [];
        data.Items?.forEach((item) =>
            items.push(
                new Follow(
                    item[this.followerHandleAttr],
                    item[this.followeeHandleAttr]
                )
            )
        );
        return items;
    }
}
