/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, this method output downscaled to 1/1000.
* @param date date object for any datetime, if blank output the current datetime.
* @return unixtime in seconds.
*/
export function dateEncode(date?:Date){
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Since the unixtime that can be handled by the `Date` is in milliseconds, the argument of this method is internally multiplied by x1000.
* @param time unixtime in seconds.
* @return date object specified by `time`.
*/
export function dateDecode(time:number){
    return new Date(time * 1000);
}