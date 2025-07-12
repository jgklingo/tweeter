import { Buffer } from "buffer";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { User, AuthToken } from "tweeter-shared";

export interface RegisterView extends AuthenticationView {
    setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
    private imageBytes: Uint8Array;
    private imageFileExtension: string;

    public constructor(view: RegisterView) {
        super(view);
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

    protected getOperationDescription(): string {
        return "register user";
    };

    protected getUserAuthToken(firstName: string, lastName: string, alias: string, password: string): Promise<[User, AuthToken]> {
        return this.userService.register(
            firstName,
            lastName,
            alias,
            password,
            this.imageBytes,
            this.imageFileExtension
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
}
