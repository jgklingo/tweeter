import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { mock, instance, verify, anything } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login component", () => {
    it("starts with the sign-in button disabled", () => {
        const { signInButton } = getLogin();
        expect(signInButton).toBeDisabled();
    });
    it("enables the sign-in button if both the alias and password fields have text", async () => {
        const { signInButton, aliasField, passwordField, user } = getLogin();
        await user.type(aliasField, "alias");
        await user.type(passwordField, "password");
        expect(signInButton).toBeEnabled();
    });
    it("disables the sign-in button if either the alias or password fields are cleared", async () => {
        const { signInButton, aliasField, passwordField, user } = getLogin();
        await user.type(aliasField, "alias");
        await user.type(passwordField, "password");
        expect(signInButton).toBeEnabled();
        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "alias");
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });
    it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "/";
        const alias = "alias";
        const password = "password";
        const { signInButton, aliasField, passwordField, user } = getLogin(originalUrl, mockPresenterInstance);
        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);
        verify(mockPresenter.doAuthentication(anything(), anything(), alias, password, anything(), originalUrl)).once();
    });
});

const renderLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
    render(<MemoryRouter>
        {(!!presenter ?
            (<Login originalUrl={originalUrl} presenter={presenter} />) :
            (<Login originalUrl={originalUrl} />))}
    </MemoryRouter>)
};

const getLogin = (originalUrl?: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInButton, aliasField, passwordField, user }
};
