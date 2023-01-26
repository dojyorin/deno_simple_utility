/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, this method output downscaled to 1/1000.
* @param date date object for any datetime, if blank output the current datetime.
* @return unixtime in seconds.
*/
export function unixtimeEncode(date?:Date){
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, the argument of this method is internally multiplied by x1000.
* @param time unixtime in seconds.
* @return date object specified by `time`.
*/
export function unixtimeDecode(time:number){
    return new Date(time * 1000);
}

/**
* Convert formatted datetime string such as ISO8601 to unixtime.
* @param dt formatted datetime string.
* @return unixtime in seconds.
*/
export function unixtimeParse(dt:string){
    const [y, mo, d, h, mi, s] = dt.split(/[/ :TZ_.-]/i).map(s => Number(s));

    return unixtimeEncode(new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0));
}