/**
* Are you running on Windows?
* @example
* ```ts
* const runOnWin = isWin();
* ```
*/
export function isWin():boolean{
    return Deno.build.os === "windows";
}