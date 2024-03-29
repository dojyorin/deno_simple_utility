/**
* Make interfaces acceptable in `Record` type arguments.
*/
export type Opt<T> = Partial<Record<keyof T, unknown>>;

function hasObject(data:Record<string | number | symbol, unknown>, key:string){
    return Object.hasOwn(data, key) && typeof data[key] === "object" && data[key] !== null;
}

/**
* Applies `Object.freeze()` recursively.
* @example
* ```ts
* const freeze = deepFreeze({
*     aaa: {
*         bbb: true
*     }
* });
* ```
*/
export function deepFreeze<T extends Opt<T>>(data:T):T{
    Object.freeze(data);

    for(const key in data){
        if(hasObject(data, key) && !Object.isFrozen(data[key])){
            deepFreeze(data[key]);
        }
    }

    return data;
}

/**
* Applies `Object.seal()` recursively.
* @example
* ```ts
* const seal = deepSeal({
*     aaa: {
*         bbb: true
*     }
* });
* ```
*/
export function deepSeal<T extends Opt<T>>(data:T):T{
    Object.seal(data);

    for(const key in data){
        if(hasObject(data, key) && !Object.isSealed(data[key])){
            deepSeal(data[key]);
        }
    }

    return data;
}