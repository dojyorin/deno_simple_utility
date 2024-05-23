/**
* Convert from binary to base64 encoded string.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = base64Encode(bin);
* const decode = base64Decode(encode);
* ```
*/
export function base64Encode(data:Uint8Array):string{
    return btoa(Array.from(data, v => String.fromCharCode(v)).join(""));
}

/**
* Convert from binary to base64 encoded DataURL.
* Default MIME type is `application/octet-stream`.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const data = base64EncodeDataURL(bin);
* ```
*/
export function base64EncodeDataURL(data:Uint8Array, type?:string):string{
    return `data:${type ?? "application/octet-stream"};base64,${base64Encode(data)}`;
}

/**
* Convert from base64 encoded string to binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = base64Encode(bin);
* const decode = base64Decode(encode);
* ```
*/
export function base64Decode(data:string):Uint8Array{
    return new Uint8Array(Array.from(atob(data), v => v.charCodeAt(0)));
}