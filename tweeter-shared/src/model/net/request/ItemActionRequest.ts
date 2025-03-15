import { TweeterRequest } from "./TweeterRequest";

export interface ItemActionRequest<T> extends TweeterRequest {
    readonly item: T;
}
