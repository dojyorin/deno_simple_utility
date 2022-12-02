import {dirname, fromFileUrl} from "../deps.ts";

/**
* Convert from backslash to slash.
* @param path Windows style (backslash) path string.
* @return POSIX style (slash) path string.
*/
export function posixSep(path:string){
    return path.replaceAll("\\", "/");
}

/**
* Check if it's running on Windows.
* @return `true` if running on Windows.
*/
export function isWin(){
    return Deno.build.os === "windows";
}

/**
* Returns the system wide temporary directory path for each platform.
* @return `/tmp` if running on Linux or Mac, `C:/Windows/Temp` if running on Windows.
*/
export function tmpPath(){
    switch(Deno.build.os){
        case "linux": return "/tmp";
        case "darwin": return "/tmp";
        case "windows": return "C:/Windows/Temp";
        default: throw new Error();
    }
}

/**
* Returns the system wide user directory path for each platform.
* @return `$HOME` if running on Linux or Mac, `%USERPROFILE%` if running on Windows.
*/
export function homePath(){
    const {HOME, USERPROFILE} = Deno.env.toObject();

    switch(Deno.build.os){
        case "linux": return `${HOME}`;
        case "darwin": return `${HOME}`;
        case "windows": return posixSep(`${USERPROFILE}`);
        default: throw new Error();
    }
}

/**
* Move current directory to `Deno.mainModule`.
*/
export function cwdMain(){
    Deno.chdir(fromFileUrl(dirname(Deno.mainModule)));
}