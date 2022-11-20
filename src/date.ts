/**
* Convert from Date object to unix time.
* Since the UnixTime that can be handled by the Date object is in milliseconds, this method output downscaled to 1/1000.
* @param date The date object. If blank output the current time.
*/
export function dateEncode(date?:Date){
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Convert from unix time to Date object.
* Since the UnixTime that can be handled by the Date object is in milliseconds, the argument of this method is internally multiplied by x1000.
* @param time The unix time.
*/
export function dateDecode(time:number){
    return new Date(time * 1000);
}