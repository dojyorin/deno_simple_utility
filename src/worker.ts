/**
* Communication content between main thread and worker thread.
*/
export interface WorkerMessage<T extends unknown>{
    message: T;
    transfer?: Transferable[];
}

/**
* Content of processing run by worker thread.
*/
export type TaskAction<T extends unknown, K extends unknown> = (message:T) => WorkerMessage<K> | Promise<WorkerMessage<K>>;

/**
* Run registered `TaskAction` in worker thread.
*/
export type TaskContext<T extends unknown, K extends unknown> = (message:T, transfer?:Transferable[]) => Promise<K>;

/**
* Register `TaskAction` and return reusable task execution context.
* `Worker` instance is created and destroyed each time they run `TaskContext`.
* `import` can only use "syntax", not "declaration".
* @example
* ```ts
* const task = createTask<number, number>(async(data)=>{
*     const {delay} = await import("https://deno.land/std/async/mod.ts");
*     await delay(1000);
*     return {
*         message: data * 2
*     };
* });
* const result1 = await task(1);
* const result2 = await task(2);
* ```
*/
export function createTask<T extends unknown, K extends unknown>(task:TaskAction<T, K>):TaskContext<T, K>{
    const script = task.toString();
    const regist = /*js*/`
        globalThis.onmessage = async({data})=>{
            const {message, transfer} = await(${script})(data);
            globalThis.postMessage(message, {
                transfer: transfer
            });
        };
    `;
    const url = URL.createObjectURL(new Blob([regist]));

    return (message:T, transfer?:Transferable[])=>{
        return new Promise<K>((res, rej)=>{
            const worker = new Worker(url, {
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
                transfer: transfer
            });
        });
    };
}