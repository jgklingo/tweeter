import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
    originalUrl?: string;
}

const Login = (props: Props) => {
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const checkSubmitButtonStatus = (): boolean => {
        return presenter.checkSubmitButtonStatus(alias, password);
    }

    const doLogin = async () => {
        presenter.doAuthentication('', '', alias, password, rememberMe, props.originalUrl)
    }

    const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
            doLogin();
        }
    };

    const listener: LoginView = {
        updateUserInfo: updateUserInfo,
        navigate: navigate,
        displayErrorMessage: displayErrorMessage,
        setIsLoading: setIsLoading
    }

    const [presenter] = useState(new LoginPresenter(listener));

    const inputFieldGenerator = () => {
        return (
            <AuthenticationFields
                onKeyDown={loginOnEnter}
                setAlias={setAlias}
                setPassword={setPassword}
            />
        );
    };

    const switchAuthenticationMethodGenerator = () => {
        return (
            <div className="mb-3">
                Not registered? <Link to="/register">Register</Link>
            </div>
        );
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Sign In"
            submitButtonLabel="Sign in"
            oAuthHeading="Sign in with:"
            inputFieldGenerator={inputFieldGenerator}
            switchAuthenticationMethodGenerator={
                switchAuthenticationMethodGenerator
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            isLoading={isLoading}
            submit={doLogin}
        />
    );
};

export default Login;
