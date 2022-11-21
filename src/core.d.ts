/**
* function returning arbitrary types.
*/
export type SyncFunction<T extends unknown = void> = () => T;

/**
* function returning arbitrary async types.
*/
export type AsyncFunction<T extends unknown = void> = SyncFunction<Promise<T>>;