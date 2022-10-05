export {type JsonValue} from "https://deno.land/std@0.158.0/encoding/json/stream.ts";

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