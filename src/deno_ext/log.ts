import {Logger, ConsoleHandler, FileHandler, format} from "../../deps.ts";

function logRecord(date:Date, level:string, message:string) {
    return `${format(date, "yyyy-MM-ddTHH:mm:ss")} [${level}] ${message}`;
}

/**
* Start logging.
* Output to console for general and also write to file if `path` is defined.
* @see https://deno.land/std/log
* @example
* ```ts
* const log = logEntry();
* ```
*/
export function logEntry(name?:string, path?:string):Logger {
    const level = "INFO";

    const log = new Logger(name ?? "log", level, {
        handlers: [
            new ConsoleHandler(level, {
                formatter({datetime, levelName, msg}) {
                    return logRecord(datetime, levelName, msg);
                }
            })
        ]
    });

    if(path) {
        log.handlers.push(
            new FileHandler(level, {
                filename: path,
                formatter({datetime, levelName, msg}) {
                    return logRecord(datetime, levelName, msg);
                }
            })
        );
    }

    for(const h of log.handlers) {
        h.setup();
    }

    return log;
}