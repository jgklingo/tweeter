import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Status } from "tweeter-shared";

export class SQSQueueHelper {
    readonly statusesSqsUrl = "https://sqs.us-east-1.amazonaws.com/438465170134/tweeterStatuses";
    readonly statusesForUserSqsUrl = "https://sqs.us-east-1.amazonaws.com/438465170134/tweeterStatusesForUser";

    private sqsClient = new SQSClient();

    public async queueStatus(authorHandle: string, status: Status) {
        const params = {
            MessageBody: JSON.stringify({
                author_handle: authorHandle,
                status_dto: status.dto
            }),
            QueueUrl: this.statusesSqsUrl
        };
        await this.sqsClient.send(new SendMessageCommand(params));
    }

    public async queueFeedUpdates(feedOwnerHandles: string[], status: Status) {
        feedOwnerHandles.forEach(async (feedOwnerHandle) => {
            const params = {
                MessageBody: JSON.stringify({
                    feed_owner_handle: feedOwnerHandle,
                    status_dto: status.dto
                }),
                QueueUrl: this.statusesForUserSqsUrl
            };
            await this.sqsClient.send(new SendMessageCommand(params));
        })
    }
}