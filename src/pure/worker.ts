import {base64DataURL} from "./base64.ts";
import {u8Encode} from "./text.ts";

interface TaskMessage<T extends unknown>{
    message: T;
    transfers?: Transferable[];
}

/**
* Content of processing run by worker thread.
*/
export type TaskAction<T extends unknown, K extends unknown> = (message:T) => TaskMessage<K> | Promise<TaskMessage<K>>;

/**
* Run registered `TaskAction` in worker thread.
*/
export type TaskContext<T extends unknown, K extends unknown> = (message:T, transfers?:Transferable[]) => Promise<K>;

/**
* Register `TaskAction` and return reusable task execution context.
* `Worker` instance is created and destroyed each time they run `TaskContext`.
* `import` can only use "syntax", not "declaration".
* @example
* ```ts
* const task = workerTask<number, number>(async(data)=>{
*     const {delay} = await import("https://deno.land/std/async/mod.ts");
*     await delay(data);
*     return {
*         message: data * 2
*     };
* });
* const result1 = await task(10);
* const result2 = await task(20);
* ```
*/
export function workerTask<T extends unknown, K extends unknown>(task:TaskAction<T, K>):TaskContext<T, K>{
    const script = /*js*/`
        globalThis.onmessage = async({data})=>{
            const {message, transfers} = await(${task.toString()})(data);
            globalThis.postMessage(message, {
                transfer: transfers
            });
        };
    `;

    return (message, transfers)=>{
        return new Promise<K>((res, rej)=>{
            const worker = new Worker(base64DataURL(u8Encode(script), "text/javascript"), {
                type: "module"
            });

            worker.onmessage = ({data})=>{
                res(data);
                worker.terminate();
            };

            worker.onerror = (e)=>{
                rej(e);
                worker.terminate();
            };

            worker.onmessageerror = (e)=>{
                rej(e);
                worker.terminate();
            };

            worker.postMessage(message, {
                transfer: transfers
            });
        });
    };
}