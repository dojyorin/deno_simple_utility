import {type Opt} from "./deep.ts";
import {mainPath} from "./path.deno.ts";

/**
* Read JSON file and convert to object.
* @example
* ```ts
* const object = await jsonRead("./resource.json");
* ```
*/
export async function jsonRead<T extends Opt<T>>(path:string):Promise<T>{
    return JSON.parse(await Deno.readTextFile(path));
}

/**
* Convert from object to JSON and write to file.
* @example
* ```ts
* await jsonWrite("./resource.json", {
*     foo: "bar"
* });
* ```
*/
export async function jsonWrite<T extends Opt<T>>(path:string, data:T):Promise<void>{
    await Deno.writeTextFile(path, JSON.stringify(data, undefined, 4));
}

/**
* Read JSON file and convert to object.
* If JSON file does not exist create new file with default value.
* Argument default value also act as type definition.
* @example
* ```ts
* import dresource from "./resource.json" assert {type: "json"};
* const resource = await jsonLoad("./resource.json", dresource);
* ```
*/
export async function jsonLoad<T extends Opt<T>>(path:string, def:T):Promise<T>{
    try{
        return await jsonRead<T>(path);
    }
    catch(e){
        if(e instanceof Deno.errors.NotFound){
            await jsonWrite(path, def);
        }
        else{
            throw e;
        }
    }

    return def;
}

/**
* Wrapper function of `jsonLoad()`.
* Config file path is fixed `${Deno.mainModule}/config.json`.
* @example
* ```ts
* import dconfig from "./config.json" assert {type: "json"};
* const config = await configLoad(dconfig);
* ```
*/
export async function configLoad<T extends Opt<T>>(def:T):Promise<T>{
    return await jsonLoad(`${mainPath()}/config.json`, def);
}