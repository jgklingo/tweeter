import { LoginRequest } from "./LoginRequest";

export interface RegisterRequest extends LoginRequest {
    readonly firstName: string;
    readonly lastName: string;
    readonly imageStringBase64: string;
    readonly imageFileExtension: string;
}
