/**
* Function returning arbitrary types.
*/
export type SyncFunction<T extends unknown = void> = () => T;

/**
* Function returning arbitrary async types.
*/
export type AsyncFunction<T extends unknown = void> = SyncFunction<Promise<T>>;

/**
* Possible types of JSON.
*/
export type JsonStruct = string | number | boolean | null | JsonStruct[] | {[key in string]: JsonStruct};

/**
* The file name and byte array pairs that make up the basic file.
*/
export type FileInit = [string, Uint8Array];