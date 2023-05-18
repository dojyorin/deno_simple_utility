import {assertEquals} from "../deps.test.ts";
import {runCommand} from "../src/process.deno.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Process: Run (no args)",
    async fn(){
        const result = await runCommand("echo", "abcdefg");

        assertEquals(result, true);
    }
});