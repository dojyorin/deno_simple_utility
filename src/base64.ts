/**
* Convert from binary to base64 encoded string.
* @example
* const bin = await Deno.readFile("./file");
* const converted = base64Encode(bin);
* const restored = base64Decode(converted);
*/
export function base64Encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* Convert from base64 encoded string to binary.
* @example
* const bin = await Deno.readFile("./file");
* const converted = base64Encode(bin);
* const restored = base64Decode(converted);
*/
export function base64Decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}