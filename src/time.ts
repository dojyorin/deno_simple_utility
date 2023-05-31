/**
* Return UNIX time in seconds.
* If no argument will be calculate at current time.
* @example
* ```ts
* const time = unixtimeEncode();
* const date = unixtimeDecode(time);
* ```
*/
export function unixtimeEncode(date?:Date):number{
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Returns `Date` from UNIX time.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = unixtimeEncode();
* const date = unixtimeDecode(time);
* ```
*/
export function unixtimeDecode(time:number):Date{
    return new Date(time * 1000);
}

/**
* Convert from formatted datetime string such as ISO8601 to UNIX time in seconds.
* @example
* ```ts
* const time = unixtimeParse("2023-05-18T08:31:32.292Z");
* ```
*/
export function unixtimeParse(ds:string):number{
    const [y, mo, d, h, mi, s] = ds.split(/[/ :TZ_.-]/i).map(s => Number(s));

    return unixtimeEncode(new Date(y, (mo ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0));
}