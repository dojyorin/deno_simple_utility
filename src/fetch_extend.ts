import {type JsonValue} from "../deps.ts";

// ==============================
// = Type Definition
// ==============================
export type QueryInit = Exclude<HeadersInit, Headers> | URLSearchParams;
export type FetchResponseLabel = keyof FetchResponseMap;
export type FetchResponseType<T extends FetchResponseLabel> = FetchResponseMap[T] extends infer U ? U : never;

export interface FetchInit extends Omit<RequestInit, "window">{
    query?: QueryInit;
}

interface FetchResponseMap{
    "text": string;
    "arraybuffer": ArrayBuffer;
    "blob": Blob;
    "json": JsonValue;
    "response": Response;
    "ok": boolean;
}

// ==============================
// = Runnable Code
// ==============================
/**
* @param path Target URL. Since the query string is ignored, please specify it in the `option.query` property instead of writing it directly in the URL.
* @param type The type you want to receive in the response.
* @param option Fetch option. `window` is removed from `RequestInit` and `query` is added to write the query string.
**/
export async function fetchExtend<T extends FetchResponseLabel>(path:string, type:T, option?:FetchInit){
    const {origin, pathname} = /^http(s|):\/\//i.test(path) ? new URL(path) : new URL(path, location.href);
    const query = new URLSearchParams(option?.query).toString();

    const response = await fetch(`${origin}${pathname}${query && "?"}${query}`, {
        method: option?.method ?? "GET",
        credentials: option?.credentials ?? "omit",
        mode: option?.mode ?? "cors",
        cache: option?.cache ?? "no-cache",
        redirect: option?.redirect ?? "follow",
        keepalive: option?.keepalive ?? false,
        referrerPolicy: option?.referrerPolicy ?? "no-referrer",
        referrer: option?.referrer ?? "",
        integrity: option?.integrity ?? "",
        signal: option?.signal ?? null,
        headers: option?.headers ?? {},
        body: option?.body ?? null,
        window: null
    });

    switch(type){
        case "response": {
            return <FetchResponseType<T>>response;
        }

        case "ok": {
            return <FetchResponseType<T>>response.ok;
        }

        case "arraybuffer": {
            return <FetchResponseType<T>>await response.arrayBuffer();
        }

        case "blob": {
            return <FetchResponseType<T>>await response.blob();
        }

        case "text": {
            return <FetchResponseType<T>>await response.text();
        }

        case "json": {
            return <FetchResponseType<T>>await response.json();
        }
    }
}