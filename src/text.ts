/**
* Convert from unicode string to UTF-8 byte array.
*/
export function utfEncode(data:string){
    return new TextEncoder().encode(data);
}

/**
* Convert from UTF-8 byte array to unicode string.
*/
export function utfDecode(data:Uint8Array){
    return new TextDecoder().decode(data);
}

/**
* Convert from byte array to hex string.
*/
export function hexEncode(data:Uint8Array){
    return [...data].map(n => n.toString(16).toUpperCase().padStart(2, "0")).join("");
}

/**
* Convert from hex string to byte array.
*/
export function hexDecode(data:string){
    return new Uint8Array(data.match(/[0-9a-fA-F]{2}/g)?.map(s => parseInt(s, 16)) ?? []);
}

/**
* In addition to leading and trailing spaces, tabs, carriage returns, and two or more consecutive spaces are converted to a single space.
*/
export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}

/**
* Accurately count Unicode above `0x010000` and array them character by character.
*/
export function accurateSegment(data:string){
    return [...new Intl.Segmenter().segment(data)].map(({segment}) => segment);
}