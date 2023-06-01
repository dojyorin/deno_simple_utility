import {mainPath} from "./path.deno.ts";

/**
* Read JSON file and convert to object.
* @example
* ```ts
* const object = await jsonRead("./resource.json");
* ```
*/
export async function jsonRead<T extends unknown>(path:string):Promise<T>{
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
export async function jsonWrite<T extends unknown>(path:string, data:T):Promise<void>{
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
export async function jsonLoad<T extends unknown>(path:string, defaultv:T):Promise<T>{
    try{
        return await jsonRead<T>(path);
    }
    catch(e){
        if(e instanceof Deno.errors.NotFound){
            await jsonWrite(path, defaultv);
        }
        else{
            throw e;
        }
    }

    return defaultv;
}

/**
* Wrapper function of `jsonLoad()`.
* Path is fixed `${Deno.mainModule}/config.json`.
* @example
* ```ts
* import dconfig from "./config.json" assert {type: "json"};
* const config = await configLoad(dconfig);
* ```
*/
export async function configLoad<T extends unknown>(defaultv:T):Promise<T>{
    return await jsonLoad(`${mainPath()}/config.json`, defaultv);
}