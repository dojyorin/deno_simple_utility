import {dirname, fromFileUrl} from "../deps.ts";
import {isWindows} from "./platform.deno.ts";

/**
* Convert from backslash to slash.
*/
export function unixSlash(path:string){
    return path.replaceAll("\\", "/");
}

/**
* Convert from slash to backslash.
*/
export function windowsSlash(path:string){
    return path.replaceAll("/", "\\");
}

/**
* Returns the system wide temporary directory path for each platform.
*/
export function tmpPath(){
    return isWindows() ? "C:/Windows/Temp" : "/tmp";
}

/**
* Returns the system wide application data directory path for each platform.
*/
export function dataPath(){
    return isWindows() ? "C:/ProgramData" : "/var";
}

/**
* Returns the system wide user directory path for each platform.
*/
export function homePath(){
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return isWindows() ? unixSlash(USERPROFILE) : HOME;
}

/**
* Returns the directory of `Deno.mainModule`.
*/
export function mainPath(){
    const path = fromFileUrl(dirname(Deno.mainModule));

    return isWindows() ? unixSlash(path) : path;
}