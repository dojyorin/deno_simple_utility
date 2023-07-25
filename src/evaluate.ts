import {type Opt} from "./deep.ts";
import {base64Encode} from "./base64.ts";
import {utfEncode} from "./text.ts";

export interface DefExp<T extends unknown>{
    default: T;
}

export async function evaluateESM<T extends Opt<T>>(code:string):Promise<T>{
    return await import(`data:text/javascript;base64,${base64Encode(utfEncode(code))}`);
}