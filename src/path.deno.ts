import {dirname, fromFileUrl} from "../deps.ts";
import {isWindows} from "./platform.deno.ts";

/**
* Convert from backslash to slash.
* @param path Windows style (backslash) path string.
* @return Unix style (slash) path string.
*/
export function unixSep(path:string){
    return path.replaceAll("\\", "/");
}

/**
* Convert from slash to backslash.
* @param path Unix style (slash) path string.
* @return Windows style (backslash) path string.
*/
export function windowsSep(path:string){
    return path.replaceAll("/", "\\");
}

/**
* Returns the system wide temporary directory path for each platform.
* @return `/tmp` if running on Unix, `C:/Windows/Temp` if running on Windows.
*/
export function tmpPath(){
    return isWindows() ? "C:/Windows/Temp" : "/tmp";
}

/**
* Returns the system wide application data directory path for each platform.
* @return `/var` if running on Unix, `C:/ProgramData` if running on Windows.
*/
export function dataPath(){
    return isWindows() ? "C:/ProgramData" : "/var";
}

/**
* Returns the system wide user directory path for each platform.
* @return `$HOME` if running on Unix, `%USERPROFILE%` if running on Windows.
*/
export function homePath(){
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return isWindows() ? unixSep(USERPROFILE) : HOME;
}

/**
* Returns the directory of `Deno.mainModule`.
* @return entry point path.
*/
export function mainPath(){
    const path = fromFileUrl(dirname(Deno.mainModule));

    return isWindows() ? unixSep(path) : path;
}