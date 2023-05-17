/**
* Convert from byte array to base64 encoded string.
* @example
* const b64 = base64Encode(await Deno.readFile("/path/to/file"));
*/
export function base64Encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* Convert from base64 encoded string to byte array.
* @example
* const binary = base64Decode("SGVsbG9Xb3JsZCE=");
*/
export function base64Decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}