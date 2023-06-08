import {dirname, fromFileUrl} from "../deps.ts";
import {isWin} from "./platform.deno.ts";

/**
* Convert from backslash to slash.
* Useful for converting from Windows path to UNIX path.
* @example
* ```ts
* const path = slashUnix("C:\\file");
* ```
*/
export function slashUnix(path:string):string{
    return path.replace(/\\/g, "/");
}

/**
* Convert from slash to backslash.
* Useful for converting from UNIX path to Windows path.
* @example
* ```ts
* const path = slashWin("C:/file");
* ```
*/
export function slashWin(path:string):string{
    return path.replace(/\//g, "\\");
}

/**
* Return system-wide temporary directory path for each OS.
* `/tmp` for UNIX and `C:/Windows/Temp` for Windows.
* @example
* ```ts
* const path = tmpPath();
* ```
*/
export function tmpPath():string{
    return isWin() ? "C:/Windows/Temp" : "/tmp";
}

/**
* Return system-wide application data directory path for each OS.
* `/var` for UNIX and `C:/ProgramData` for Windows.
* @example
* ```ts
* const path = dataPath();
* ```
*/
export function dataPath():string{
    return isWin() ? "C:/ProgramData" : "/var";
}

/**
* Return system-wide home path for each OS.
* `${HOME}` for UNIX and `%USERPROFILE%` for Windows.
* @example
* ```ts
* const path = homePath();
* ```
*/
export function homePath():string{
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return isWin() ? slashUnix(USERPROFILE) : HOME;
}

/**
* Return directory of `Deno.mainModule`.
* @example
* ```ts
* const path = mainPath();
* ```
*/
export function mainPath():string{
    const path = fromFileUrl(dirname(Deno.mainModule));

    return isWin() ? slashUnix(path) : path;
}