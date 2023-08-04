/**
* Convert from binary to base64 encoded string.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = base64Encode(bin);
* const restored = base64Decode(converted);
* ```
*/
export function base64Encode(data:Uint8Array):string{
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* Convert from base64 encoded string to binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = base64Encode(bin);
* const restored = base64Decode(converted);
* ```
*/
export function base64Decode(data:string):Uint8Array{
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}

/**
* Convert from binary to base64 encoded DataURL.
* Default MIME type is `application/octet-stream`.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const url = base64DataURL(bin);
* ```
*/
export function base64DataURL(data:Uint8Array, mime?:string):string{
    return `data:${mime ?? "application/octet-stream"};base64,${base64Encode(data)}`;
}