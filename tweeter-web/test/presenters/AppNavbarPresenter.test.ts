import { AuthToken } from "tweeter-shared";
import { AppNavbarPresenter, AppNavbarView } from "../../src/presenters/AppNavbarPresenter";
import { instance, mock, verify, spy, when, anything } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        const appNavbarPresenterSpy = spy(new AppNavbarPresenter(mockAppNavbarViewInstance))
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);
        when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();
    });

    it("tells the view to clear the last info message and clear the user info when the logout is successful", async () => {
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    })

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when the \
        logout is not successful", async () => {
        const error = new Error("An error occurred");
        when(mockUserService.logout(anything())).thenThrow(error);
        await appNavbarPresenter.logOut(authToken);
        verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
    })
});
