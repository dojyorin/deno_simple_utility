/**
* Function returning arbitrary types.
*/
export type SyncFunction<T extends unknown = void> = () => T;

/**
* Function returning arbitrary async types.
*/
export type AsyncFunction<T extends unknown = void> = SyncFunction<Promise<T>>;

/**
* The file name and byte array pairs that make up the basic file.
*/
export type FileInit = [string, Uint8Array];