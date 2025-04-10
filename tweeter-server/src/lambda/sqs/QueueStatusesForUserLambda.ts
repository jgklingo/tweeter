import { StatusDto } from "tweeter-shared";
import { AWSDaoFactory } from "../../model/dao/factory/AWSDaoFactory";
import { FollowsDao } from "../../model/dao/interface/FollowsDao";
import { SQSQueueHelper } from "../../model/service/helper/SQSQueueHelper";

interface Record {
    author_handle: string;
    status_dto: StatusDto;
}

export const handler = async function (event: any) {
    const followsDao: FollowsDao = new AWSDaoFactory().getFollowsDao();
    const sqsQueueHelper = new SQSQueueHelper();

    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const record = JSON.parse(body) as Record;

        const follower_handles = (await followsDao.getAllFollowers(record.author_handle)).map(follow => follow.followerHandle);
        const handles_per_message = 100;
        for (let j = 0; j < follower_handles.length; j += handles_per_message) {
            const start = j;
            const end = Math.min(follower_handles.length, j + handles_per_message);
            await sqsQueueHelper.queueFeedUpdates(follower_handles.slice(start, end), record.status_dto);
        }
    }
}
