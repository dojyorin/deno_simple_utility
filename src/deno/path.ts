import {osWindows} from "./os.ts";

/**
* Convert from backslash to slash.
* Useful for converting from Windows path to UNIX path.
* @example
* ```ts
* const path = pathSepL("C:\\file");
* ```
*/
export function pathSepL(path:string):string{
    return path.replace(/\\/g, "/");
}

/**
* Convert from slash to backslash.
* Useful for converting from UNIX path to Windows path.
* @example
* ```ts
* const path = pathSepW("C:/file");
* ```
*/
export function pathSepW(path:string):string{
    return path.replace(/\//g, "\\");
}

/**
* System-wide temporary directory path for each OS.
* `/tmp` for UNIX and `C:/Windows/Temp` for Windows.
* @example
* ```ts
* const path = pathTmp();
* ```
*/
export function pathTmp():string{
    return osWindows ? "C:/Windows/Temp" : "/tmp";
}

/**
* System-wide application data directory path for each OS.
* `/var` for UNIX and `C:/ProgramData` for Windows.
* @example
* ```ts
* const path = pathVar();
* ```
*/
export function pathVar():string{
    return osWindows ? "C:/ProgramData" : "/var";
}

/**
* System-wide user config directory path for each OS.
* `~/.config` for UNIX and `~/AppData/Roaming` for Windows.
* @example
* ```ts
* const path = pathConfig();
* ```
*/
export function pathConfig():string{
    return `${pathHome()}/${osWindows ? "AppData/Roaming" : ".config"}`;
}

/**
* System-wide home directory path for each OS.
* `${HOME}` for UNIX and `%USERPROFILE%` for Windows.
* @example
* ```ts
* const path = pathHome();
* ```
*/
export function pathHome():string{
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return osWindows ? pathSepL(USERPROFILE) : HOME;
}

/**
* Directory of `Deno.mainModule`.
* @example
* ```ts
* const path = pathMain();
* ```
*/
export function pathMain():string{
    const directory = new URL(Deno.mainModule).pathname.replace(/[^/]*$/, "");

    return osWindows ? directory.replace(/^\//, "") : directory;
}