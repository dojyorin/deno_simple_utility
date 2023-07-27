import {Logger, handlers, format} from "../deps.ts";
import {mainPath} from "./path.deno.ts";

function logRecord(date:Date, level:string, message:string){
    return `${format(date, "yyyy-MM-ddTHH:mm:ss")} [${level}] ${message}`;
}

/**
* Instantiate logger with general configuration.
* Output to console and also to file if `name` is defined.
* Log file default save path is `${Deno.mainModule}/${name}.log`.
* @example
* ```ts
* const log = logEntry();
* ```
*/
export function logEntry(name?:string):Logger{
    const level = "INFO";

    const log = new Logger("operation", level, {
        handlers: [
            new handlers.ConsoleHandler(level, {
                formatter({datetime, levelName, msg}){
                    return logRecord(datetime, levelName, msg);
                }
            })
        ]
    });

    if(name){
        log.handlers.push(...[
            new handlers.FileHandler(level, {
                filename: `${mainPath()}/${name}.log`,
                formatter({datetime, levelName, msg}){
                    return logRecord(datetime, levelName, msg);
                }
            })
        ]);
    }

    for(const h of log.handlers){
        h.setup();
    }

    return log;
}