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