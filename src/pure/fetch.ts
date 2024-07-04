interface ReturnTypeMap {
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
export async function fetchExtend<T extends keyof ReturnTypeMap>(path: string, type: T, option?: FetchInit): Promise<ReturnTypeMap[T]> {
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
        case "text": return <ReturnTypeMap[T]> await response.text();
        case "json": return <ReturnTypeMap[T]> await response.json();
        case "form": return <ReturnTypeMap[T]> await response.formData();
        case "byte": return <ReturnTypeMap[T]> new Uint8Array(await response.arrayBuffer());
        case "buffer": return <ReturnTypeMap[T]> await response.arrayBuffer();
        case "blob": return <ReturnTypeMap[T]> await response.blob();
        case "stream": return <ReturnTypeMap[T]> (response.body ?? undefined);
        case "ok": await response.body?.cancel(); return <ReturnTypeMap[T]> response.ok;
        case "code": await response.body?.cancel(); return <ReturnTypeMap[T]> response.status;
        case "header": await response.body?.cancel(); return <ReturnTypeMap[T]> response.headers;
        case "response": return <ReturnTypeMap[T]> response;
        default: throw new Error();
    }
}