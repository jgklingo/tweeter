import { TweeterResponse } from "./TweeterResponse";

export interface UserActionResponse extends TweeterResponse {
    readonly countTuple: [followerCount: number, followeeCount: number];
}
