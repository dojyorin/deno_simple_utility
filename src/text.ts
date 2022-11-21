/**
* Convert from string to UTF-8 byte.
* @param data The string.
*/
export function ucEncode(data:string){
    return new TextEncoder().encode(data);
}

/**
* Convert from UTF-8 byte to string.
* @param data The byte.
*/
export function ucDecode(data:Uint8Array){
    return new TextDecoder().decode(data);
}

/**
* Convert from byte to hex string.
* @param data The byte.
*/
export function hexEncode(data:Uint8Array){
    return [...data].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

/**
* In addition to leading and trailing spaces, tabs, carriage returns, and two or more consecutive spaces are converted to a single space.
* @param data The string.
*/
export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}