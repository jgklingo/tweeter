import { Status, StatusDto } from "tweeter-shared";

export interface StatusDao {
    getPageOfStoryItems: (authorHandle: string, pageSize: number, lastItemTimestamp: number | undefined) =>
        Promise<[storyItems: StatusDto[], hasMore: boolean]>;
    getPageOfFeedItems: (feedOwnerHandle: string, pageSize: number, lastItemTimestamp: number | undefined) =>
        Promise<[feedItems: StatusDto[], hasMore: boolean]>;
    insertStoryItem: (authorHandle: string, storyItem: Status) => Promise<void>;
    insertFeedItem: (feedOwnerHandle: string, feedItem: Status) => Promise<void>;
    batchInsertFeedItems: (feedOwnerHandles: string[], feedItem: StatusDto) => Promise<void>;
}
