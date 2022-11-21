/**
* @param data byte array.
* @return base64 code.
*/
export function base64Encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

/**
* @param data base64 code.
* @return byte array.
*/
export function base64Decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}