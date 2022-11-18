export function date2unix(date?:Date){
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

export function unix2date(time?:number){
    return new Date(time ? time * 1000 : undefined);
}