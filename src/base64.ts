export function base64encode(data:Uint8Array){
    return btoa([...data].map(n => String.fromCharCode(n)).join(""));
}

export function base64decode(data:string){
    return new Uint8Array([...atob(data)].map(s => s.charCodeAt(0)));
}