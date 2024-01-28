/**
* Are you running on Windows?
* @example
* ```ts
* const isWin = osWin;
* ```
*/
export const osWin:boolean = Deno.build.os === "windows";