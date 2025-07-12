import { AuthToken } from "tweeter-shared";

export interface SessionsDao {
    insert: (authToken: AuthToken, userHandle: string) => Promise<void>;
    getByToken: (token: string) => Promise<[authToken: AuthToken, userHandle: string] | null>;
    delete: (token: string) => Promise<void>;
    update: (token: string, timestamp: number) => Promise<void>;
}
