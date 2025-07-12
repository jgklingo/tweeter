import "isomorphic-fetch";
import { instance, mock, verify, spy, anything, capture } from "@typestrong/ts-mockito";
import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../src/model/service/UserService";
import { PostStatusPresenter, PostStatusView } from "../src/presenters/PostStatusPresenter";
import { StatusService } from "../src/model/service/StatusService";

describe("App", () => {
    const testUserAlias = "@test";
    const testUserPassword = "test";
    const testPost = "this is a test post from Jest: " + Math.random();

    let statusService: StatusService;
    let userService: UserService;
    let user: User;
    let authToken: AuthToken;
    let postStatusPresenter: PostStatusPresenter;

    let mockPostStatusView: PostStatusView;
    let spyStatusService: StatusService;

    beforeAll(async () => {
        statusService = new StatusService();
        userService = new UserService();
        [user, authToken] = await userService.login(testUserAlias, testUserPassword);
        mockPostStatusView = mock<PostStatusView>();
        spyStatusService = spy(new StatusService());
        postStatusPresenter = new PostStatusPresenter(instance(mockPostStatusView));
        postStatusPresenter.statusService = instance(spyStatusService);
    });

    it("logs in a user", async () => {
        expect(user.alias).toBe(testUserAlias);
        expect(new Date().getTime() - authToken.timestamp).toBeLessThan(5000);
    });

    it("posts a status", async () => {
        await postStatusPresenter.submitPost(testPost, user, authToken);
        verify(spyStatusService.postStatus(authToken, anything())).once();
        const [, capturedStatus] = capture(spyStatusService.postStatus).first();
        expect(capturedStatus.post).toBe(testPost);
    });

    it("displays the 'Successfully Posted!' message", async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).once();
    }, 10000);

    it("causes the story to appear on the server", async () => {
        const statuses: Status[] = [];
        let lastItem: Status | null = null;
        let statusPage: Status[];
        let hasMore: boolean = true;
        while (hasMore) {
            [statusPage, hasMore] = await statusService.loadMoreStoryItems(authToken, user.alias, 25, lastItem);
            statuses.push(...statusPage);
            lastItem = statuses[statuses.length - 1];
        }
        const posts = statuses.map(status => status.post);
        expect(posts).toContain(testPost);
        expect(new Date().getTime() - statuses[posts.indexOf(testPost)].timestamp).toBeLessThan(10000);
    });

    afterAll(async () => {
        await userService.logout(authToken);
    })
});
