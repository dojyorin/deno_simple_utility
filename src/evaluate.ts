import {type Opt} from "./deep.ts";
import {base64Encode} from "./base64.ts";
import {utfEncode} from "./text.ts";

/**
* Auxiliary type for default export.
*/
export interface DefExp<T extends unknown>{
    default: T;
}

/**
* Evaluate ESM JavaScript code in module scope.
* @example
* ```ts
* const {default: data} = await evaluateESM<DefExp<string>>("export default 'hello!';");
* ```
*/
export async function evaluateESM<T extends Opt<T>>(code:string):Promise<T>{
    return await import(`data:text/javascript;base64,${base64Encode(utfEncode(code))}`);
}