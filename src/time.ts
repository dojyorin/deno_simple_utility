/**
* Return UNIX time in seconds.
* If no argument will be calculate at current time.
* @example
* ```ts
* const time = utEncode();
* const date = utDecode(time);
* ```
*/
export function utEncode(date?:Date):number{
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* Returns `Date` from UNIX time.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = utEncode();
* const date = utDecode(time);
* ```
*/
export function utDecode(time:number):Date{
    return new Date(time * 1000);
}

/**
* Convert from formatted datetime string such as ISO8601 to UNIX time in seconds.
* @example
* ```ts
* const time = utParse("2023-05-18T08:31:32.292Z");
* ```
*/
export function utParse(ds:string):number{
    const [y, m, d, h, mi, s] = ds.split(/[/ :TZ_.-]/i).map(v => Number(v));

    return utEncode(new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0));
}