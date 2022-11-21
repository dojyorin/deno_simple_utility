/**
* Possible types of JSON.
*/
export type JsonStruct = string | number | boolean | null | JsonStruct[] | {
    [key: string]: JsonStruct;
};

/**
* Possible input types for `URLSearchParams`.
*/
export type QueryInit = Exclude<HeadersInit, Headers> | URLSearchParams;

/**
* "id" and "password" pair.
*/
export interface IdCredential{
    id: string;
    pw: string;
}