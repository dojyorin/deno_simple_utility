/**
* Convert from string to UTF-8 binary.
* @example
* ```ts
* const text = "HelloWorld!";
* const converted = utfEncode(text);
* const restored = utfDecode(converted);
* ```
*/
export function utfEncode(data:string):Uint8Array{
    return new TextEncoder().encode(data);
}

/**
* Convert from UTF-8 binary to string.
* @example
* ```ts
* const text = "HelloWorld!";
* const converted = utfEncode(text);
* const restored = utfDecode(converted);
* ```
*/
export function utfDecode(data:Uint8Array):string{
    return new TextDecoder().decode(data);
}

/**
* Convert from binary to hex string.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = hexEncode(bin);
* const restored = hexDecode(converted);
* ```
*/
export function hexEncode(data:Uint8Array):string{
    return [...data].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

/**
* Convert from hex string to binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = hexEncode(bin);
* const restored = hexDecode(converted);
* ```
*/
export function hexDecode(data:string):Uint8Array{
    return new Uint8Array(data.match(/[0-9a-fA-F]{2}/g)?.map(s => parseInt(s, 16)) ?? []);
}

/**
* Does `String.prototype.trim()`, convert from `\t`, `\r`, and two or more consecutive spaces to single space.
* @example
* ```ts
* const text = "  Lorem ipsum\r dolor   sit \t  amet. ";
* const formated = trimExtend(text);
* ```
*/
export function trimExtend(data:string):string{
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}

/**
* Accurately recognize string that contain character above `0x010000` and array them one  by character.
* Useful for calculate number of characters with string contains emoji.
* @example
* ```ts
* const text = "😀😃😄😁😆😅😂🤣";
* const characters = accurateSegment(text);
* ```
*/
export function accurateSegment(data:string):string[]{
    return [...new Intl.Segmenter().segment(data)].map(({segment}) => segment);
}