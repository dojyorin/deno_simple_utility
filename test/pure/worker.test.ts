import {assertEquals} from "../../deps.test.ts";
import {workerTask} from "../../src/pure/worker.ts";

const sample1 = new Uint8Array([1, 2, 3, 4]);
const sample2 = new Uint8Array([2, 4, 6, 8]);

Deno.test({
    name: "Worker: Create Task.",
    async fn(){
        const task = workerTask<Uint8Array, Uint8Array>((v)=>{
            const result = v.map(n => n * 2);

            return {
                message: result,
                transfers: [result.buffer]
            };
        });

        const result = await task(sample1, [sample1.buffer]);

        assertEquals(result, sample2);
    }
});