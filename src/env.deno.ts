/**
* Map of env value type and string specify them.
*/
export interface EnvType{
    "string": string;
    "number": number;
    "boolean": boolean;
}

/**
* Convert environment variable to specified type and get.
* @example
* ```ts
* const port = envGet("SERVER_PORT", "number", true);
* ```
*/
export function envGet<T extends keyof EnvType, U extends boolean>(key:string, type:T, required:U):U extends true ? EnvType[T] : EnvType[T] | undefined{
    const env = Deno.env.get(key);

    if(env === undefined){
        if(required){
            throw new Error(key);
        }
        else{
            return <U extends true ? EnvType[T] : EnvType[T] | undefined>env;
        }
    }

    switch(type){
        case "string": return <EnvType[T]>env;
        case "number": return <EnvType[T]>Number(env);
        case "boolean": return <EnvType[T]>(env === "true");
        default: throw new Error();
    }
}