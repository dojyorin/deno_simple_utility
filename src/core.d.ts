/**
* Possible types of JSON.
*/
export type JsonStruct = string | number | boolean | null | JsonStruct[] | {[key: string]: JsonStruct};

/**
* ECMAScript primitive types.
*/
export type PrimitiveValue = string | number | bigint | boolean | symbol;