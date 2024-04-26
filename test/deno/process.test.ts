import {assertEquals} from "../../deps.test.ts";
import {processRun} from "../../src/deno/process.ts";

Deno.test({
    name: "Process: Run (no args)",
    async fn(){
        const result = await processRun("echo", "abcdefg");

        assertEquals(result, true);
    }
});