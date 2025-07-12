import { User } from "./User";

export class Follow {
    private _followerHandle: string;
    private _followeeHandle: string;

    public constructor(followerHandle: string, followeeHandle: string) {
        this._followerHandle = followerHandle;
        this._followeeHandle = followeeHandle;
    }

    public get followerHandle(): string {
        return this._followerHandle;
    }

    public set followerHandle(value: string) {
        this._followerHandle = value;
    }

    public get followeeHandle(): string {
        return this._followeeHandle;
    }

    public set followeeHandle(value: string) {
        this._followeeHandle = value;
    }
}
