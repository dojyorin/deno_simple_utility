/**
* Convert from string to UTF-8 byte array.
* @param data The string.
*/
export function textEncode(data:string){
    return new TextEncoder().encode(data);
}

/**
* Convert from UTF-8 byte array to string.
* @param data The byte array.
*/
export function textDecode(data:Uint8Array){
    return new TextDecoder().decode(data);
}

/**
* In addition to leading and trailing spaces, tabs, carriage returns, and two or more consecutive spaces are converted to a single space.
* @param data The string.
*/
export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}