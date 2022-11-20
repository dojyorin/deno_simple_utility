/**
* In addition to leading and trailing spaces, tabs, carriage returns, and two or more consecutive spaces are converted to a single space.
* @param data The string.
*/
export function trimExtend(data:string){
    return data.trim().replace(/\r/g, "").replace(/\t/g, " ").replace(/ +/g, " ").replace(/ +$/mg, "");
}