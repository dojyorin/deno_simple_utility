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