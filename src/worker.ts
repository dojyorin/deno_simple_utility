/**
* WIP.
*/
export interface WorkerMessage<T>{
    message: T;
    transfer?: Transferable[];
}

/**
* WIP.
*/
export type WorkerTask<T, K> = (message:T) => WorkerMessage<K> | Promise<WorkerMessage<K>>;

/**
* WIP.
* @example
* ```ts
* const task = createTask(()=>{});
* ```
*/
export function createTask<T, K>(task:WorkerTask<T, K>){
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