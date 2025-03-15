import { TweeterResponse } from "./TweeterResponse";

export interface PrimitiveResponse<T> extends TweeterResponse {
    readonly primitive: T;
}
