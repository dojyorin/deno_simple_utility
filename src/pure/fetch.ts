import {b64Encode} from "./base64.ts";

interface ResponseType{
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
* Added `query` which allows you to specify query string and `secret` which allows you to specify secret value to `RequestInit`.
*/
export interface FetchInit extends Omit<RequestInit, "integrity" | "window">{
    signal?: AbortSignal;
    headers?: Headers;
    body?: BodyInit;
    query?: URLSearchParams;
    secret?: {
        key: string;
        id?: undefined;
        pw?: undefined;
    } | {
        key?: undefined;
        id: string;
        pw: string;
    };
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

    if(option?.secret?.key){
        h.set("Authorization", `Bearer ${option.secret.key}`);
    }
    else if(option?.secret?.id){
        h.set("Authorization", `Basic ${btoa(`${option.secret.id}:${option.secret.pw}`)}`);
    }

    const response = await fetch(u, {
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