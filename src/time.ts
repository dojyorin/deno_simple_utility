/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, this method output downscaled to 1/1000.
*/
export function unixtimeEncode(date?:Date){
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, the argument of this method is internally multiplied by x1000.
*/
export function unixtimeDecode(time:number){
    return new Date(time * 1000);
}

/**
* Convert formatted datetime string such as ISO8601 to unixtime.
*/
export function unixtimeParse(dt:string){
    const [y, mo, d, h, mi, s] = dt.split(/[/ :TZ_.-]/i).map(s => Number(s));

    return unixtimeEncode(new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0));
}