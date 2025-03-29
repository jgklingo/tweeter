import { User } from "tweeter-shared";

export interface UsersDao {
    insert: (user: User, hashedPassword: string) => Promise<void>;
    getByHandle: (handle: string) => Promise<[user: User, hashedPassword: string] | null>;
}
