import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { RegisterPresenter, RegisterView } from "../../../presenters/RegisterPresenter";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { updateUserInfo } = useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const checkSubmitButtonStatus = (): boolean => {
        return presenter.checkSubmitButtonStatus(firstName, lastName, alias, password, imageUrl)
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        presenter.handleImageFile(file);
    };

    const doRegister = async () => {
        presenter.doAuthentication(firstName, lastName, alias, password, rememberMe)
    }

    const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !checkSubmitButtonStatus()) {
            doRegister();
        }
    };

    const listener: RegisterView = {
        updateUserInfo: updateUserInfo,
        navigate: navigate,
        displayErrorMessage: displayErrorMessage,
        setIsLoading: setIsLoading,
        setImageUrl: setImageUrl
    }

    const [presenter] = useState(new RegisterPresenter(listener));

    const inputFieldGenerator = () => {
        return (
            <>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        size={50}
                        id="firstNameInput"
                        placeholder="First Name"
                        onKeyDown={registerOnEnter}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                    <label htmlFor="firstNameInput">First Name</label>
                </div>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        size={50}
                        id="lastNameInput"
                        placeholder="Last Name"
                        onKeyDown={registerOnEnter}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <label htmlFor="lastNameInput">Last Name</label>
                </div>
                <AuthenticationFields
                    onKeyDown={registerOnEnter}
                    setAlias={setAlias}
                    setPassword={setPassword}
                />
                <div className="form-floating mb-3">
                    <input
                        type="file"
                        className="d-inline-block py-5 px-4 form-control bottom"
                        id="imageFileInput"
                        onKeyDown={registerOnEnter}
                        onChange={handleFileChange}
                    />
                    <label htmlFor="imageFileInput">User Image</label>
                    <img src={imageUrl} className="img-thumbnail" alt=""></img>
                </div>
            </>
        );
    };

    const switchAuthenticationMethodGenerator = () => {
        return (
            <div className="mb-3">
                Already registered? <Link to="/login">Sign in</Link>
            </div>
        );
    };

    return (
        <AuthenticationFormLayout
            headingText="Please Register"
            submitButtonLabel="Register"
            oAuthHeading="Register with:"
            inputFieldGenerator={inputFieldGenerator}
            switchAuthenticationMethodGenerator={
                switchAuthenticationMethodGenerator
            }
            setRememberMe={setRememberMe}
            submitButtonDisabled={checkSubmitButtonStatus}
            isLoading={isLoading}
            submit={doRegister}
        />
    );
};

export default Register;
