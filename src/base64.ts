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