import {type JsonValue} from "https://deno.land/std@0.158.0/encoding/json/stream.ts";

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