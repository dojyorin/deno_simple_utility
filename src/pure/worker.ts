/**
* Content of processing run by worker thread.
*/
export type TaskAction<T extends unknown, K extends unknown> = (message:T) => TaskMessage<K> | Promise<TaskMessage<K>>;

/**
* Run registered `TaskAction` in worker thread.
*/
export type TaskContext<T extends unknown, K extends unknown> = (message:T, transfers?:(Transferable | ArrayBufferView)[]) => Promise<K>;

/**
* Communication content between main thread and worker thread.
*/
export interface TaskMessage<T extends unknown>{
    message: T;
    transfers?: (Transferable | ArrayBufferView)[];
}

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
            const {message, transfers} = await(${script})(data);
            globalThis.postMessage(message, {
                transfer: transfers?.map(v => "buffer" in v ? v.buffer : v)
            });
        };
    `;

    return (message, transfers)=>{
        return new Promise<K>((res, rej)=>{
            const url = URL.createObjectURL(new Blob([regist]));
            const worker = new Worker(url, {
                type: "module"
            });

            function disposeWorker(){
                worker.terminate();
                URL.revokeObjectURL(url);
            }

            worker.onmessage = ({data})=>{
                res(data);
                disposeWorker();
            };

            worker.onerror = (e)=>{
                rej(e);
                disposeWorker();
            };

            worker.onmessageerror = (e)=>{
                rej(e);
                disposeWorker();
            };

            worker.postMessage(message, {
                transfer: transfers?.map(v => "buffer" in v ? v.buffer : v)
            });
        });
    };
}