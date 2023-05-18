/**
* Are you running on Windows?
* @example
* ```ts
* const runOnWin = isWin();
* ```
*/
export function isWin(){
    return Deno.build.os === "windows";
}