import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDao } from "../interface/StatusDao";
import { DynamoDBClientLoader } from "./DynamoDBClientLoader";
import { Status, StatusDto } from "tweeter-shared";

export class DynamoDBStatusDao implements StatusDao {
    readonly storyTableName = "story";
    readonly feedTableName = "feed";
    readonly authorHandleAttr = "author_handle";
    readonly feedOwnerHandleAttr = "feed_owner_handle";
    readonly timestampAttr = "timestamp";
    readonly statusDtoAttr = "status_dto";

    private readonly client = DynamoDBClientLoader.getInstance().documentClient;

    public async getPageOfStoryItems(authorHandle: string, pageSize: number, lastItemTimestamp: number | undefined = undefined) {
        const params = {
            KeyConditionExpression: this.authorHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": authorHandle,
            },
            TableName: this.storyTableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItemTimestamp === undefined
                    ? undefined
                    : {
                        [this.authorHandleAttr]: authorHandle,
                        [this.timestampAttr]: lastItemTimestamp
                    }
        };

        const items: StatusDto[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => {
            items.push(item[this.statusDtoAttr]);
        })

        return [items, hasMorePages] as [StatusDto[], boolean];
    }

    public async getPageOfFeedItems(feedOwnerHandle: string, pageSize: number, lastItemTimestamp: number | undefined = undefined) {
        const params = {
            KeyConditionExpression: this.feedOwnerHandleAttr + " = :f",
            ExpressionAttributeValues: {
                ":f": feedOwnerHandle,
            },
            TableName: this.feedTableName,
            Limit: pageSize,
            ExclusiveStartKey:
                lastItemTimestamp === undefined
                    ? undefined
                    : {
                        [this.feedOwnerHandleAttr]: feedOwnerHandle,
                        [this.timestampAttr]: lastItemTimestamp
                    }
        };

        const items: StatusDto[] = [];
        const data = await this.client.send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        data.Items?.forEach((item) => {
            items.push(item[this.statusDtoAttr]);
        })

        return [items, hasMorePages] as [StatusDto[], boolean];
    }

    public async insertStoryItem(authorHandle: string, storyItem: Status) {
        const params = {
            TableName: this.storyTableName,
            Item: {
                [this.authorHandleAttr]: authorHandle,
                [this.timestampAttr]: storyItem.timestamp,
                [this.statusDtoAttr]: storyItem.dto
            }
        };
        await this.client.send(new PutCommand(params));
    }

    public async insertFeedItem(feedOwnerHandle: string, feedItem: Status) {
        const params = {
            TableName: this.feedTableName,
            Item: {
                [this.feedOwnerHandleAttr]: feedOwnerHandle,
                [this.timestampAttr]: feedItem.timestamp,
                [this.statusDtoAttr]: feedItem.dto
            }
        };
        await this.client.send(new PutCommand(params));
    }
}
