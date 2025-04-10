import { StatusDto } from "tweeter-shared";
import { AWSDaoFactory } from "../../model/dao/factory/AWSDaoFactory";
import { StatusDao } from "../../model/dao/interface/StatusDao";

interface Record {
    feed_owner_handles: string[];
    status_dto: StatusDto;
}

export const handler = async function (event: any) {
    const statusDao: StatusDao = new AWSDaoFactory().getStatusDao();

    for (let i = 0; i < event.Records.length; ++i) {
        const startTimeMillis = new Date().getTime();

        const { body } = event.Records[i];
        const record = JSON.parse(body) as Record;

        for (let j = 0; j < record.feed_owner_handles.length; j += 25) {
            const start = j;
            const end = Math.min(record.feed_owner_handles.length, j + 25);
            await statusDao.batchInsertFeedItems(record.feed_owner_handles.slice(start, end), record.status_dto);
        }

        const elapsedTime = new Date().getTime() - startTimeMillis;
        if (elapsedTime < 1000) {
            await new Promise<void>((resolve) => setTimeout(resolve, 1000 - elapsedTime));
        }
    }
}
