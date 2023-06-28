import {assertEquals, exists} from "../deps.test.ts";
import {logEntry} from "../src/log.deno.ts";

Deno.test({
    name: "Log: Entry",
    async fn(){
        const log = logEntry();
        log.info("Lorem ipsum dolor sit amet.");

        const result = await exists("./operation.log", {
            isFile: true
        });

        assertEquals(result, true);

        for(const h of log.handlers){
            h.destroy();
        }
    }
});