import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
            ScanIndexForward: false,
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
            ScanIndexForward: false,
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

    // public async batchInsertFeedItem(feedOwnerHandles: string[], feedItem: Status) {
    //     const params = {
    //         RequestItems: {
    //             [this.feedTableName]: feedOwnerHandles.map(handle => (
    //                 {
    //                     PutRequest: {
    //                         Item: {
    //                             [this.feedOwnerHandleAttr]: handle,
    //                             [this.timestampAttr]: feedItem.timestamp,
    //                             [this.statusDtoAttr]: feedItem.dto
    //                         }
    //                     }
    //                 })
    //             )
    //         }
    //     };
    //     let resp = await this.client.send(new BatchWriteCommand(params));
    //     while (resp.UnprocessedItems !== undefined && Object.keys(resp.UnprocessedItems).length > 0) {
    //         params.RequestItems = resp.UnprocessedItems;
    //         resp = await this.client.send(new BatchWriteCommand(params));
    //     }
    // }

    public async batchInsertFeedItems(feedOwnerHandles: string[], feedItem: StatusDto) {
        if (feedOwnerHandles.length == 0) {
            return;
        }

        const params = {
            RequestItems: {
                [this.feedTableName]: this.createPutStatusRequestItems(
                    feedOwnerHandles,
                    feedItem
                ),
            },
        };

        try {
            const resp = await this.client.send(new BatchWriteCommand(params));
            await this.putUnprocessedItems(resp, params);
        } catch (err) {
            throw new Error(
                `Error while batch writing users with params: ${params}: \n${err}`
            );
        }
    }

    private createPutStatusRequestItems(feedOwnerHandles: string[], feedItem: StatusDto) {
        return feedOwnerHandles.map((handle) =>
            this.createPutStatusRequest(handle, feedItem)
        );
    }

    private createPutStatusRequest(feedOwnerHandle: string, feedItem: StatusDto) {
        const item = {
            [this.feedOwnerHandleAttr]: feedOwnerHandle,
            [this.timestampAttr]: feedItem.timestamp,
            [this.statusDtoAttr]: feedItem
        };

        return {
            PutRequest: {
                Item: item,
            },
        };
    }

    private async putUnprocessedItems(
        resp: BatchWriteCommandOutput,
        params: BatchWriteCommandInput
    ) {
        let delay = 10;
        let attempts = 0;

        while (
            resp.UnprocessedItems !== undefined &&
            Object.keys(resp.UnprocessedItems).length > 0
        ) {
            attempts++;

            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }

            // console.log(
            //     `Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length
            //     } unprocessed users.`
            // );

            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new BatchWriteCommand(params));
        }
    }
}
