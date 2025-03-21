import { AuthToken, ItemActionRequest, PagedItemRequest, RegisterRequest, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
    const serverFacade = new ServerFacade();

    it("returns a User and AuthToken upon registration", async () => {
        const request: RegisterRequest = {
            firstName: "test",
            lastName: "user",
            imageStringBase64: "abcdef",
            imageFileExtension: "png",
            alias: "@test_user",
            password: "pwpwpw",
            token: ""
        };
        const [user, authToken] = await serverFacade.register(request);

        expect(user).toBeInstanceOf(User);
        expect(user.alias).not.toBeNull();
        expect(user.firstName).not.toBeNull();
        expect(user.lastName).not.toBeNull();

        expect(authToken).toBeInstanceOf(AuthToken);
        expect(authToken.token).not.toBeNull();
        expect(authToken.timestamp).not.toBeNull();
    });

    it("gets more followers of a user", async () => {
        const firstRequest: PagedItemRequest<UserDto> = {
            userAlias: "@test_user",
            pageSize: 3,
            lastItem: null,
            token: "abc-def"
        };
        const [followers, hasMore] = await serverFacade.getMoreFollowers(firstRequest);

        followers.forEach((follower) => expect(follower).toBeInstanceOf(User));
        expect(hasMore).toBe(true);
        expect(followers.length).toBe(3);

        const secondRequest = {
            userAlias: "@test_user",
            pageSize: 3,
            lastItem: followers[followers.length - 1].dto,
            token: "abc-def"
        };
        const [moreFollowers, moreHasMore] = await serverFacade.getMoreFollowers(secondRequest);
        moreFollowers.forEach((follower) => expect(followers).not.toContain(follower));
        moreFollowers.forEach((follower) => expect(follower).toBeInstanceOf(User));
        expect(moreHasMore).toBe(true);
        expect(moreFollowers.length).toBe(3);
    });

    it("gets the following and follower count of a user", async () => {
        const request: ItemActionRequest<UserDto> = {
            item: new User("test", "user", "@test_user", "foo").dto,
            token: "abc-def"
        };
        const followeeCount = await serverFacade.getFolloweeCount(request);

        expect(typeof followeeCount).toBe('number');
        expect(followeeCount).toBeGreaterThanOrEqual(0);

        const followerCount = await serverFacade.getFollowerCount(request);

        expect(typeof followerCount).toBe('number');
        expect(followerCount).toBeGreaterThanOrEqual(0);
    });
});
