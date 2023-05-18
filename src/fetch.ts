import {type JsonStruct} from "./core.d.ts";

/**
* Possible input for `URLSearchParams`.
*/
export type QueryInit = Exclude<HeadersInit, Headers> | URLSearchParams;

/**
* `RequestInit` with added `query` property that can specify query-string.
*/
export interface FetchInit extends Omit<RequestInit, "window">{
    query?: QueryInit;
}

/**
* Map of fetch response type and string specify them.
*/
export interface ResponseType{
    "text": string;
    "json": JsonStruct;
    "form": FormData;
    "byte": Uint8Array;
    "buffer": ArrayBuffer;
    "blob": Blob;
    "ok": boolean;
    "code": number;
    "header": Headers;
    "response": Response;
}

/**
* Extended fetch function that can specify response type directly.
* @example
* ```ts
* const response = await fetchExtend("./asset", "byte");
* ```
*/
export async function fetchExtend<T extends keyof ResponseType>(path:string, type:T, option?:FetchInit):Promise<ResponseType[T]>{
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
        case "text": return <ResponseType[T]>await response.text();
        case "json": return <ResponseType[T]>await response.json();
        case "form": return <ResponseType[T]>await response.formData();
        case "byte": return <ResponseType[T]>new Uint8Array(await response.arrayBuffer());
        case "buffer": return <ResponseType[T]>await response.arrayBuffer();
        case "blob": return <ResponseType[T]>await response.blob();
        case "ok": return <ResponseType[T]>response.ok;
        case "code": return <ResponseType[T]>response.status;
        case "header": return <ResponseType[T]>response.headers;
        case "response": return <ResponseType[T]>response;
        default: throw new Error();
    }
}