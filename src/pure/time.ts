import {textPadZero} from "./text.ts";

function dateFormat(date:string){
    const [y, m, d, h, mi, s] = date.split(/[/ :TZ_.-]/i).map(v => Number(v));

    return new Date(y, (m ?? 1) - 1, d ?? 1, h ?? 0, mi ?? 0, s ?? 0);
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
* UNIX time from `Date` or formatted datetime string.
* If no args will be current time.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = timeEncode();
* const date = timeDecode(time);
* ```
*/
export function timeEncode(dt?:Date | string):number{
    return Math.floor((dt instanceof Date ? dt : typeof dt === "string" ? dateFormat(dt) : new Date()).getTime() / 1000);
}

/**
* `Date` from UNIX time or formatted datetime string.
* Note that in seconds not milliseconds.
* @example
* ```ts
* const time = timeEncode();
* const date = timeDecode(time);
* ```
*/
export function timeDecode(dt?:number | string):Date{
    switch(typeof dt){
        case "string": return dateFormat(dt);
        case "number": return new Date(dt * 1000);
        default: return new Date();
    }
}

/**
* Generate serialized string from current or any `Date` or UNIX time to "yyyyMMddhhmmss".
* @example
* ```ts
* const format = timeFormatSerialize();
* ```
*/
export function timeFormatSerialize(dt?:Date | number | string, split?:boolean):string{
    const ss = split ? "/" : "";
    const sc = split ? ":" : "";
    const date = dt instanceof Date ? dt : timeDecode(dt);

    return `${date.getFullYear()}${ss}${textPadZero(date.getMonth() + 1)}${ss}${textPadZero(date.getDate())}${split ? " " : ""}${textPadZero(date.getHours())}${sc}${textPadZero(date.getMinutes())}${sc}${textPadZero(date.getSeconds())}`;
}