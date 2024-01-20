/**
* WIP.
*/
export interface WorkerMessage<T extends unknown>{
    message: T;
    transfer?: Transferable[];
}

/**
* WIP.
*/
export type WorkerTask<T extends unknown, K extends unknown> = (message:T) => WorkerMessage<K> | Promise<WorkerMessage<K>>;

/**
* WIP.
*/
export type WorkerContext<T extends unknown, K extends unknown> = (message:T, transfer?:Transferable[]) => Promise<K>;

/**
* WIP.
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
export function createTask<T extends unknown, K extends unknown>(task:WorkerTask<T, K>):WorkerContext<T, K>{
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
                type: "module",
                deno: {
                    permissions: "inherit"
                }
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