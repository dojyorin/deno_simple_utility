interface ResponseType {
    "text": string;
    "json": unknown;
    "form": FormData;
    "byte": Uint8Array;
    "buffer": ArrayBuffer;
    "blob": Blob;
    "stream": ReadableStream<Uint8Array> | undefined;
    "ok": boolean;
    "code": number;
    "header": Headers;
    "response": Response;
}

/**
* Added `query` which allows you to specify query string to `RequestInit`.
*/
export interface FetchInit extends Omit<RequestInit, "integrity" | "window"> {
    signal?: AbortSignal;
    headers?: Headers;
    body?: BodyInit;
    query?: URLSearchParams;
}

/**
* Extended fetch function that can specify response type directly.
* @example
* ```ts
* const response = await fetchExtend("./asset", "byte");
* ```
*/
export async function fetchExtend<T extends keyof ResponseType>(path:string, type:T, option?:FetchInit):Promise<ResponseType[T]> {
    const u = new URL(path, globalThis?.location?.href);
    u.hash = "";

    for(const [k, v] of option?.query ?? []) {
        u.searchParams.set(k, v);
    }

    const response = await fetch(u, {
        method: option?.method ?? "GET",
        credentials: option?.credentials ?? "omit",
        mode: option?.mode ?? "cors",
        cache: option?.cache ?? "no-store",
        redirect: option?.redirect ?? "follow",
        keepalive: option?.keepalive ?? false,
        referrerPolicy: option?.referrerPolicy ?? "no-referrer",
        referrer: option?.referrer,
        signal: option?.signal,
        headers: option?.headers,
        body: option?.body
    });

    switch(type) {
        case "text": return <ResponseType[T]>await response.text();
        case "json": return <ResponseType[T]>await response.json();
        case "form": return <ResponseType[T]>await response.formData();
        case "byte": return <ResponseType[T]>new Uint8Array(await response.arrayBuffer());
        case "buffer": return <ResponseType[T]>await response.arrayBuffer();
        case "blob": return <ResponseType[T]>await response.blob();
        case "stream": return <ResponseType[T]>(response.body ?? undefined);
        case "ok": await response.body?.cancel(); return <ResponseType[T]>response.ok;
        case "code": await response.body?.cancel(); return <ResponseType[T]>response.status;
        case "header": await response.body?.cancel(); return <ResponseType[T]>response.headers;
        case "response": return <ResponseType[T]>response;
        default: throw new Error();
    }
}