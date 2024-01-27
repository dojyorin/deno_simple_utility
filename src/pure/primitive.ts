type WidenLiteral<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
type MaybeString = string | null | undefined;
type TypeStrict<T extends unknown, U extends boolean> = U extends true ? T : T | undefined;

interface PrimitiveMap{
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
* const value = primitiveParse("123", "number", true);
* ```
*/
export function primitiveParse<T extends keyof PrimitiveMap, U extends boolean>(text:MaybeString, type:T, strict?:U):TypeStrict<PrimitiveMap[T], U>{
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

/**
* Convert from dirty text to specified type.
* If cannot be parsed, use default (`def`) value.
* Convert to same type as default value.
* @example
* ```ts
* const value = primitiveParseX("123", 0);
* ```
*/
export function primitiveParseX<T extends string | number | boolean>(text:MaybeString, def:T):WidenLiteral<T>{
    switch(typeof def){
        case "string": {
            const v = String(text);

            if(text === undefined || text === null){
                return <WidenLiteral<T>>def;
            }

            return <WidenLiteral<T>>v;
        }

        case "number": {
            const v = Number(text);

            if(text === undefined || text === null || isNaN(v)){
                return <WidenLiteral<T>>def;
            }

            return <WidenLiteral<T>>v;
        }

        case "boolean": {
            switch(text){
                case "true": return <WidenLiteral<T>>true;
                case "false": return <WidenLiteral<T>>false;
                default: return <WidenLiteral<T>>def;
            }
        }

        default: throw new Error();
    }
}