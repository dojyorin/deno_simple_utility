import {b64Encode} from "./base64.ts";

/**
* `RequestInit` with added `query` property that can specify query string.
*/
export interface FetchInit extends Omit<RequestInit, "integrity" | "window">{
    signal?: AbortSignal;
    headers?: Headers;
    body?: BodyInit;
    query?: URLSearchParams;
    secret?: {
        token: string;
        basic?: true;
    };
}

/**
* Map of fetch response type and string specify them.
*/
export interface ResponseType{
    "text": string;
    "base64": string;
    "json": unknown;
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
    const u = new URL(path, globalThis?.location?.href);
    const h = new Headers(option?.headers);

    u.hash = "";

    for(const [k, v] of option?.query ?? []){
        u.searchParams.set(k, v);
    }

    if(option?.secret){
        if(option.secret.basic){
            const [id, pw] = option.secret.token.split(/:/);
            u.username = id ?? "";
            u.password = pw ?? "";
        }
        else{
            h.set("Authorization", `Bearer ${option.secret.token}`);
        }
    }

    const response = await fetch(u.href, {
        method: option?.method ?? "GET",
        credentials: option?.credentials ?? "omit",
        mode: option?.mode ?? "cors",
        cache: option?.cache ?? "no-cache",
        redirect: option?.redirect ?? "follow",
        keepalive: option?.keepalive ?? false,
        referrerPolicy: option?.referrerPolicy ?? "no-referrer",
        referrer: option?.referrer,
        signal: option?.signal,
        headers: [...h.keys()].length ? h : undefined,
        body: option?.body
    });

    switch(type){
        case "text": return <ResponseType[T]>await response.text();
        case "base64": return <ResponseType[T]>b64Encode(new Uint8Array(await response.arrayBuffer()));
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