import {osWin} from "./os.ts";

/**
* Convert from backslash to slash.
* Useful for converting from Windows path to UNIX path.
* @example
* ```ts
* const path = slashU("C:\\file");
* ```
*/
export function slashU(path:string):string{
    return path.replace(/\\/g, "/");
}

/**
* Convert from slash to backslash.
* Useful for converting from UNIX path to Windows path.
* @example
* ```ts
* const path = slashW("C:/file");
* ```
*/
export function slashW(path:string):string{
    return path.replace(/\//g, "\\");
}

/**
* System-wide temporary directory path for each OS.
* `/tmp` for UNIX and `C:/Windows/Temp` for Windows.
* @example
* ```ts
* const path = tmpPath();
* ```
*/
export function tmpPath():string{
    return osWin ? "C:/Windows/Temp" : "/tmp";
}

/**
* System-wide application data directory path for each OS.
* `/var` for UNIX and `C:/ProgramData` for Windows.
* @example
* ```ts
* const path = dataPath();
* ```
*/
export function dataPath():string{
    return osWin ? "C:/ProgramData" : "/var";
}

/**
* System-wide user config directory path for each OS.
* `~/.config` for UNIX and `~/AppData/Roaming` for Windows.
* @example
* ```ts
* const path = configPath();
* ```
*/
export function configPath():string{
    return `${homePath()}/${osWin ? "AppData/Roaming" : ".config"}`;
}

/**
* System-wide home directory path for each OS.
* `${HOME}` for UNIX and `%USERPROFILE%` for Windows.
* @example
* ```ts
* const path = homePath();
* ```
*/
export function homePath():string{
    const {HOME, USERPROFILE} = Deno.env.toObject();

    return osWin ? slashU(USERPROFILE) : HOME;
}

/**
* Directory of `Deno.mainModule`.
* @example
* ```ts
* const path = mainPath();
* ```
*/
export function mainPath():string{
    const {protocol, origin, pathname} = new URL(Deno.mainModule);
    const path = pathname.replace(/[^/]*$/, "");

    return protocol === "file:" ? osWin ? path.replace(/^\//, "") : path : `${origin}${path}`;
}