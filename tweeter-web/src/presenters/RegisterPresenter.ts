import { Buffer } from "buffer";
import { UserService } from "../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";
import { ErrorPresenter, ErrorView } from "./Presenter";

export interface RegisterView extends ErrorView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
    navigate: (to: string) => void | Promise<void>;
    setIsLoading: (value: boolean) => void;
    setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends ErrorPresenter<RegisterView> {
    private userService: UserService;
    private imageBytes: Uint8Array;
    private imageFileExtension: string;

    public constructor(view: RegisterView) {
        super(view);
        this.userService = new UserService();
        this.imageBytes = new Uint8Array();
        this.imageFileExtension = "";
    }

    public checkSubmitButtonStatus(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageUrl: string
    ): boolean {
        return (
            !firstName ||
            !lastName ||
            !alias ||
            !password ||
            !imageUrl ||
            !this.imageFileExtension
        );
    };

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.imageBytes = bytes;
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.imageFileExtension = fileExtension;
            }
        } else {
            this.view.setImageUrl("");
            this.imageBytes = new Uint8Array();
        }
    };

    private getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    };

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        rememberMe: boolean
    ) {
        this.doFailureReportingOperation(
            async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await this.userService.register(
                    firstName,
                    lastName,
                    alias,
                    password,
                    this.imageBytes,
                    this.imageFileExtension
                );

                this.view.updateUserInfo(user, user, authToken, rememberMe);
                this.view.navigate("/");
            },
            "register user",
            () => {
                this.view.setIsLoading(false);
            }
        );
    };
}
