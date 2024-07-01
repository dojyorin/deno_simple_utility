import {type Opt} from "../pure/deep.ts";

/**
* Read JSON file and convert to object.
* @example
* ```ts
* const json = await jsonRead("./data.json");
* ```
*/
export async function jsonRead<T extends Opt<T>>(path:string):Promise<T> {
    return JSON.parse(await Deno.readTextFile(path));
}

/**
* Convert from object to JSON and write to file.
* @example
* ```ts
* await jsonWrite("./data.json", {
*     foo: "bar"
* });
* ```
*/
export async function jsonWrite<T extends Opt<T>>(path:string, data:T):Promise<void> {
    await Deno.writeTextFile(path, JSON.stringify(data, undefined, 4));
}

/**
* Read JSON file and convert to object.
* If JSON file does not exist create new file with default value.
* Argument default value also act as type definition.
* @example
* ```ts
* import data from "./data.json" with {type: "json"};
* const json = await jsonLoad("./data.json", data);
* ```
*/
export async function jsonLoad<T extends Opt<T>>(path:string, def:T):Promise<T> {
    try {
        return await jsonRead<T>(path);
    } catch(e) {
        if(e instanceof Deno.errors.NotFound) {
            await jsonWrite(path, def);
        } else {
            throw e;
        }
    }

    return def;
}