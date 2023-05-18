/**
* Are you running on Windows?
* @example
* const runOnWin = isWin();
*/
export function isWin(){
    return Deno.build.os === "windows";
}