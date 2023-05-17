/**
* Convert from byte array to base64 encoded string.
* @example
* const base64 = base64Encode(await Deno.readFile("./file"));
* const binary = base64Decode(base64);
*/
export function base64Encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* Convert from base64 encoded string to byte array.
* @example
* const base64 = base64Encode(await Deno.readFile("./file"));
* const binary = base64Decode(binary);
*/
export function base64Decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}