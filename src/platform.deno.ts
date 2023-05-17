/**
* Check if it's running on Windows.
*/
export function isWindows(){
    return Deno.build.os === "windows";
}