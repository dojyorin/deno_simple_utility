/**
* @param data unicode string.
* @return byte array in UTF-8 format.
*/
export function ucEncode(data:string){
    return new TextEncoder().encode(data);
}

/**
* @param data byte array in UTF-8 format.
* @return unicode string.
*/
export function ucDecode(data:Uint8Array){
    return new TextDecoder().decode(data);
}

/**
* @param data byte array.
* @return hexadecimal string.
*/
export function hexEncode(data:Uint8Array){
    return [...data].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

/**
* In addition to leading and trailing spaces, tabs, carriage returns, and two or more consecutive spaces are converted to a single space.
* @param data messy string.
* @return formatted string.
*/
export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}