/**
* Possible types of JSON.
*/
export type JsonStruct = string | number | boolean | null | JsonStruct[] | {[key in string]: JsonStruct};

/**
* "id" and "password" pair.
*/
export interface IdCredential{
    id: string;
    pw: string;
}