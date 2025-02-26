import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { instance, mock, spy, when, verify, anything, capture } from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;

    const authToken = new AuthToken("abc123", 0);
    const user = new User("Test", "User", "testuser", "/");
    const statusString = "test post"

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);
        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(statusString, user, authToken);
        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(statusString, user, authToken);
        verify(mockStatusService.postStatus(authToken, anything())).once();
        let [, status] = capture(mockStatusService.postStatus).last();
        expect(status.post).toBe(statusString);
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when posting of the status is successful", async () => {
        await postStatusPresenter.submitPost(statusString, user, authToken);
        await new Promise(resolve => setTimeout(resolve, 2000));
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });

    it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when posting of the status is not successful", async () => {
        const error = new Error("An error occurred");
        when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);
        await postStatusPresenter.submitPost(statusString, user, authToken);
        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", anything())).never();
    })
});