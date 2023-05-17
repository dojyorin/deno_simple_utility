import {dirname, fromFileUrl} from "../deps.ts";
import {isWin} from "./platform.deno.ts";

/**
* Convert from backslash to slash.
* @example
* const path = unixSlash("C:\\file");
*/
export function unixSlash(path:string){
    return path.replaceAll("\\", "/");
}

/**
* Convert from slash to backslash.
* @example
* const path = windowsSlash("C:/file");
*/
export function windowsSlash(path:string){
    return path.replaceAll("/", "\\");
}

/**
* Returns the system wide temporary directory path for each platform.
* @example
* const path = tmpPath();
*/
export function tmpPath(){
    return isWin() ? "C:/Windows/Temp" : "/tmp";
}

/**
* Returns the system wide application data directory path for each platform.
* @example
* const path = dataPath();
*/
export function dataPath(){
    return isWin() ? "C:/ProgramData" : "/var";
}

/**
* Returns the system wide user directory path for each platform.
* @example
* const path = homePath();
*/
export function homePath(){
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return isWin() ? unixSlash(USERPROFILE) : HOME;
}

/**
* Returns the directory of `Deno.mainModule`.
* @example
* const path = mainPath();
*/
export function mainPath(){
    const path = fromFileUrl(dirname(Deno.mainModule));

    return isWin() ? unixSlash(path) : path;
}