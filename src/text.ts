export function text2byte(data:string){
    return new TextEncoder().encode(data);
}

export function byte2text(data:Uint8Array){
    return new TextDecoder().decode(data);
}

export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}