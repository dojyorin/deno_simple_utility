/**
* Are you running on Windows?
* @example
* ```ts
* const isWin = osWin;
* ```
*/
export const osWindows:boolean = Deno.build.os === "windows";

/**
* Are you running on Mac?
* @example
* ```ts
* const isWin = osMac;
* ```
*/
export const osMac:boolean = Deno.build.os === "darwin";

/**
* Are you running on Linux?
* @example
* ```ts
* const isWin = osLinux;
* ```
*/
export const osLinux:boolean = Deno.build.os === "linux";