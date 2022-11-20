/**
* Convert from BASE64 code to byte array.
* @param data The byte array.
*/
export function base64Encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* Convert from byte array to BASE64 code.
* @param data The base64 code.
*/
export function base64Decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}