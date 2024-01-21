/**
* WIP.
*/
export type MaybeString = string | null | undefined;

/**
* WIP.
*/
export type TypeStrict<T extends unknown, U extends boolean> = U extends true ? T : T | undefined;

/**
* WIP.
*/
export interface PrimitiveMap{
    "s": string;
    "n": number;
    "b": boolean;
}

/**
* WIP.
* @example
* ```ts
* const value = typeDecode("123", "n", true);
* ```
*/
export function typeDecode<T extends keyof PrimitiveMap, U extends boolean>(text:MaybeString, type:T, strict?:U):TypeStrict<PrimitiveMap[T], U>{
    switch(type){
        case "s": return <PrimitiveMap[T]>typeS(text, strict);
        case "n": return <PrimitiveMap[T]>typeN(text, strict);
        case "b": return <PrimitiveMap[T]>typeB(text, strict);
        default: throw new Error();
    }
}

/**
* WIP.
* @example
* ```ts
* const value = typeS("foo", true);
* ```
*/
export function typeS<T extends boolean>(text:MaybeString, strict?:T):TypeStrict<string, T>{
    if(text === undefined || text === null){
        if(strict){
            throw new Error();
        }

        return <TypeStrict<string, T>>undefined;
    }

    return String(text);
}

/**
* WIP.
* @example
* ```ts
* const value = typeN("123", true);
* ```
*/
export function typeN<T extends boolean>(text:MaybeString, strict?:T):TypeStrict<number, T>{
    const n = Number(text);

    if(text === undefined || text === null || isNaN(n)){
        if(strict){
            throw new Error();
        }

        return <TypeStrict<number, T>>undefined;
    }

    return n;
}

/**
* WIP.
* @example
* ```ts
* const value = typeB("true", true);
* ```
*/
export function typeB<T extends boolean>(text:MaybeString, strict?:T):TypeStrict<boolean, T>{
    switch(text){
        case "true": return true;
        case "false": return false;
        default: {
            if(strict){
                throw new Error();
            }

            return <TypeStrict<boolean, T>>undefined;
        }
    }
}