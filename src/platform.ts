import {dirname, fromFileUrl} from "../deps.ts";

/**
* @return `true` if running on Windows.
*/
export function isWin(){
    const os = Deno?.build.os;

    if(!os){
        throw new Error();
    }

    return os === "windows";
}

/**
* @return `"C:/Windows/Temp"` if running on Windows, or `"/tmp"` if running on Linux or Mac.
*/
export function tmpPath(){
    switch(Deno?.build.os){
        case "windows": return "C:/Windows/Temp";
        case "linux": return "/tmp";
        case "darwin": return "/tmp";
        default: throw new Error();
    }
}

/**
* Move current directory to `Deno.mainModule`.
*/
export function cwdMain(){
    const ep = Deno?.mainModule;

    if(!ep){
        throw new Error();
    }

    Deno?.chdir(fromFileUrl(dirname(ep)));
}