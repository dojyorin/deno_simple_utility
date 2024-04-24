import {padZero} from "./text.ts";

/**
* Wait for specified time.
* Return actual elapsed wait time.
* @example
* ```ts
* await delay(1000);
* ```
*/
export async function delay(time:number):Promise<number>{
    const t0 = performance.now();
    await new Promise<void>(done => setTimeout(done, time));
    const t1 = performance.now();

    return Math.ceil(t1 - t0);
}

/**
* UNIX time in seconds.
* If no args will be current time.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = timeEncodeEpoch();
* const date = timeDecodeEpoch(time);
* ```
*/
export function timeEncodeEpoch(date?:Date):number{
    return Math.floor((date ?? new Date()).getTime() / 1000);
}

/**
* `Date` from UNIX time.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = timeEncodeEpoch();
* const date = timeDecodeEpoch(time);
* ```
*/
export function timeDecodeEpoch(time:number):Date{
    return new Date(time * 1000);
}

/**
* Convert from formatted datetime string such as ISO8601 to UNIX time in seconds.
* @example
* ```ts
* const time = timeParseEpoch("2023-05-18T08:31:32.292Z");
* ```
*/
export function timeParseEpoch(ds:string):number{
    const [y, m, d, h, mi, s] = ds.split(/[/ :TZ_.-]/i).map(v => Number(v));

    return timeEncodeEpoch(new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0));
}

/**
* Generate serialized string from current or any `Date` to "yyyyMMddhhmmss".
* @example
* ```ts
* const format = timeSerial();
* ```
*/
export function timeSerial(date?:Date, split?:boolean):string{
    const d = date ?? new Date();
    const ss = split ? "/" : "";
    const sc = split ? ":" : "";

    return `${d.getFullYear()}${ss}${padZero(d.getMonth() + 1)}${ss}${padZero(d.getDate())}${split ? " " : ""}${padZero(d.getHours())}${sc}${padZero(d.getMinutes())}${sc}${padZero(d.getSeconds())}`;
}