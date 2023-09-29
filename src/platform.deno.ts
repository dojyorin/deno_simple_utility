/**
* Are you running on Windows?
* @example
* ```ts
* const win = isWin();
* ```
*/
export function isWin():boolean{
    return Deno.build.os === "windows";
}