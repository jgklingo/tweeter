import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { mock, instance, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook"

const mockUser = mock<User>();
const mockUserInstance = instance(mockUser);
const mockAuthToken = mock<AuthToken>();
const mockAuthTokenInstance = instance(mockAuthToken);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
        currentUser: mockUserInstance,
        authToken: mockAuthTokenInstance,
    });
});

describe("PostStatus", () => {
    it("starts with the Post Status and Clear buttons disabled", () => {
        const { postStatusButton, clearButton } = getPostStatus();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });
    it("enables the Post Status and Clear buttons when the text field has text", async () => {
        const { textField, postStatusButton, clearButton, user } = getPostStatus();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
        await user.type(textField, "post content");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });
    it("disables the Post Status and Clear buttons when the text field is cleared", async () => {
        const { textField, postStatusButton, clearButton, user } = getPostStatus();
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
        await user.type(textField, "post content");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
        await user.clear(textField);
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });
    it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const postContent = "post content";
        const { textField, postStatusButton, user } = getPostStatus(mockPresenterInstance);
        await user.type(textField, postContent);
        await user.click(postStatusButton);
        verify(mockPresenter.submitPost(postContent, mockUserInstance, mockAuthTokenInstance)).once();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    // render(<MemoryRouter>
    //     <PostStatus />
    // </MemoryRouter>)
    (!!presenter ?
        render(<PostStatus presenter={presenter} />) :
        render(<PostStatus />));
};

const getPostStatus = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const textField = screen.getByRole("textbox");
    const postStatusButton = screen.getByRole("button", { name: /Post Status/ });
    const clearButton = screen.getByRole("button", { name: /Clear/ });

    return { textField, postStatusButton, clearButton, user };
};
