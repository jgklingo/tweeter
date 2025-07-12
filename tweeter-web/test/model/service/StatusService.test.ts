import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("StatusService", () => {
    const statusService = new StatusService();

    it("returns a user's story pages", async () => {
        const authToken = new AuthToken("foo", 0);
        const [storyItems, hasMore] = await statusService.loadMoreStoryItems(authToken, "@test_user", 3, null);

        storyItems.forEach((storyItem) => expect(storyItem).toBeInstanceOf(Status));
        expect(hasMore).toBe(true);
        expect(storyItems.length).toBe(3);

        const [moreStoryItems, moreHasMore] = await statusService.loadMoreStoryItems(authToken, "@test_user", 3, storyItems[storyItems.length - 1]);

        moreStoryItems.forEach((storyItem) => expect(storyItems).not.toContain(storyItem));
        moreStoryItems.forEach((storyItem) => expect(storyItem).toBeInstanceOf(Status));
        expect(moreHasMore).toBe(true);
        expect(moreStoryItems.length).toBe(3);
    });
});
