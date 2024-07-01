type WidenLiteral<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T;
type MaybeString = string | null | undefined;
type TypeStrict<T extends unknown, U extends boolean> = U extends true ? T : T | undefined;

interface TypeMap {
    "string": string;
    "number": number;
    "boolean": boolean;
}

function strictUndef(strict?:boolean) {
    if(strict){
        throw new Error();
    }

    return undefined;
}

/**
* Convert from dirty text to specified type.
* Enabling `strict` flag will throw exception if parsing failed.
* @example
* ```ts
* const value = primitiveParse("123", "number", true);
* ```
*/
export function primitiveParse<T extends keyof TypeMap, U extends boolean>(text:MaybeString, type:T, strict?:U):TypeStrict<TypeMap[T], U> {
    if(text === undefined || text === null) {
        return <TypeStrict<TypeMap[T], U>>strictUndef(strict);
    }

    switch(type) {
        case "string": return <TypeStrict<TypeMap[T], U>>text.toString();
        case "number": return <TypeStrict<TypeMap[T], U>>parseInt(text);
        case "boolean": return <TypeStrict<TypeMap[T], U>>(text === "true");
        default: throw new Error();
    }
}

/**
* Convert from dirty text to specified type.
* If parsing failed use default (`def`) value.
* Convert to same type as default value.
* @example
* ```ts
* const value = primitiveParseX("123", 0);
* ```
*/
export function primitiveParseX<T extends string | number | boolean>(text:MaybeString, def:T):WidenLiteral<T> {
    if(text === undefined || text === null) {
        return <WidenLiteral<T>>def;
    }

    switch(typeof def) {
        case "string": return <WidenLiteral<T>>text.toString();
        case "number": return <WidenLiteral<T>>parseInt(text);
        case "boolean": return <WidenLiteral<T>>(text === "true");
        default: throw new Error();
    }
}