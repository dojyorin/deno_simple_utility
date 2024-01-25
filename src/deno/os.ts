/**
* Are you running on Windows?
* @example
* ```ts
* const isWin = osWin;
* ```
*/
export const osWin = Deno.build.os === "windows";