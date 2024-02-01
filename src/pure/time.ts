import {pad0} from "./text.ts";

/**
* UNIX time in seconds.
* If no args will be current time.
* Note that in seconds not milliseconds.
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
* `Date` from UNIX time.
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
* Generate serialized string from current or any `Date` to "yyyyMMddhhmmss".
* @example
* ```ts
* const format = dtSerial();
* ```
*/
export function dtSerial(date?:Date, split?:boolean):string{
    const d = date ?? new Date();
    const ss = split ? "/" : "";
    const sc = split ? ":" : "";

    return `${d.getFullYear()}${ss}${pad0(d.getMonth() + 1)}${ss}${pad0(d.getDate())}${split ? " " : ""}${pad0(d.getHours())}${sc}${pad0(d.getMinutes())}${sc}${pad0(d.getSeconds())}`;
}