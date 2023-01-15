/**
* Check if it's running on Windows.
* @return `true` if running on Windows.
*/
export function isWin(){
    return Deno.build.os === "windows";
}