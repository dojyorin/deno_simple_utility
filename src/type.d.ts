/**
* Possible types of JSON.
*/
export type JsonStruct = string | number | boolean | null | JsonStruct[] | {[key in string]: JsonStruct};

/**
* ECMAScript primitive types.
*/
export type PrimitiveValue = string | number | bigint | boolean | symbol;

/**
* "id" and "password" pair.
*/
export interface IdCredential{
    id: string;
    pw: string;
}