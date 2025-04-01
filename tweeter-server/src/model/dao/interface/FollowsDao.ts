import { Follow } from "tweeter-shared";

export interface FollowsDao {
    insert: (follow: Follow) => Promise<void>;
    getPageOfFollowers: (followeeHandle: string, pageSize: number, lastFollowerHandle: string | undefined) =>
        Promise<[followers: Follow[], hasMore: boolean]>;
    getPageOfFollowees: (followerHandle: string, pageSize: number, lastFolloweeHandle: string | undefined) =>
        Promise<[followees: Follow[], hasMore: boolean]>;
    getAllFollowers: (followeeHandle: string) => Promise<Follow[]>;
    getAllFollowees: (followerHandle: string) => Promise<Follow[]>;
    find: (follow: Follow) => Promise<Follow | null>;
    delete: (follow: Follow) => Promise<void>;
}
