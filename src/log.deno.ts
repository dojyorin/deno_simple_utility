import {Logger, ConsoleHandler, FileHandler, formatDate} from "../deps.ts";
import {mainPath} from "./path.deno.ts";

function logRecord(date:Date, level:string, message:string){
    return `${formatDate(date, "yyyy-MM-ddTHH:mm:ss")} [${level}] ${message}`;
}

/**
* Instantiate logger with general configuration.
* Output to console and file.
* Log file default save path is `${Deno.mainModule}/execution.log`.
* @example
* ```ts
* const log = setupLog();
* ```
*/
export function setupLog(name?:string):Logger{
    const logName = name ?? "execution";
    const level = "INFO";

    const log = new Logger(logName, level, {
        handlers: [
            new ConsoleHandler(level, {
                formatter({datetime, levelName, msg}){
                    return logRecord(datetime, levelName, msg);
                }
            }),
            new FileHandler(level, {
                filename: `${mainPath()}/${logName}.log`,
                formatter({datetime, levelName, msg}){
                    return logRecord(datetime, levelName, msg);
                }
            })
        ]
    });

    for(const h of log.handlers){
        h.setup();
    }

    return log;
}