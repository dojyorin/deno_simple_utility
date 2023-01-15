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
* Convert from slash to backslash.
* @param path POSIX style (slash) path string.
* @return Windows style (backslash) path string.
*/
export function winSep(path:string){
    return path.replaceAll("/", "\\");
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
        case "linux": return HOME;
        case "darwin": return HOME;
        case "windows": return posixSep(USERPROFILE);
        default: throw new Error();
    }
}

/**
* Returns the directory of `Deno.mainModule`.
* @return entry point path.
*/
export function mainPath(){
    const path = fromFileUrl(dirname(Deno.mainModule));

    switch(Deno.build.os){
        case "linux": return path;
        case "darwin": return path;
        case "windows": return posixSep(path);
        default: throw new Error();
    }
}