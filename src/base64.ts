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
    return btoa([...data].map(v => String.fromCharCode(v)).join(""));
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
    return new Uint8Array([...atob(data)].map(v => v.charCodeAt(0)));
}

/**
* Convert from binary to base64 encoded DataURL.
* Default MIME type is `application/octet-stream`.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const data = base64DataURL(bin);
* ```
*/
export function base64DataURL(data:Uint8Array, mime?:string):string{
    return `data:${mime ?? "application/octet-stream"};base64,${base64Encode(data)}`;
}