/**
* Something that might be string.
*/
export type MaybeString = string | null | undefined;

/**
* Whether to allow `undefined`.
*/
export type TypeStrict<T extends unknown, U extends boolean> = U extends true ? T : T | undefined;

/**
* Map of primitive types and string that specify them.
*/
export interface PrimitiveMap{
    "string": string;
    "number": number;
    "boolean": boolean;
}

function undef(strict?:boolean){
    if(strict){
        throw new Error();
    }

    return undefined;
}

/**
* Convert from dirty text to specified type.
* Enabling `strict` flag will throw exception if parsing is not possible.
* @example
* ```ts
* const value = typeDecode("123", "number", true);
* ```
*/
export function typeDecode<T extends keyof PrimitiveMap, U extends boolean>(text:MaybeString, type:T, strict?:U):TypeStrict<PrimitiveMap[T], U>{
    switch(type){
        case "string": {
            const v = String(text);

            if(text === undefined || text === null){
                return <TypeStrict<PrimitiveMap[T], U>>undef(strict);
            }

            return <TypeStrict<PrimitiveMap[T], U>>v;
        }

        case "number": {
            const v = Number(text);

            if(text === undefined || text === null || isNaN(v)){
                return <TypeStrict<PrimitiveMap[T], U>>undef(strict);
            }

            return <TypeStrict<PrimitiveMap[T], U>>v;
        }

        case "boolean": {
            switch(text){
                case "true": return <TypeStrict<PrimitiveMap[T], U>>true;
                case "false": return <TypeStrict<PrimitiveMap[T], U>>false;
                default: return <TypeStrict<PrimitiveMap[T], U>>undef(strict);
            }
        }

        default: throw new Error();
    }
}