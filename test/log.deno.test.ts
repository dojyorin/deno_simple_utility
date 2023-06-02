import {assertEquals, exists} from "../deps.test.ts";
import {setupLog} from "../src/log.deno.ts";

Deno.test({
    name: "Log: Setup",
    async fn(){
        const log = setupLog();
        log.info("Lorem ipsum dolor sit amet.");

        const result = await exists("./execution.log", {
            isFile: true
        });

        assertEquals(result, true);

        for(const h of log.handlers){
            h.destroy();
        }
    }
});