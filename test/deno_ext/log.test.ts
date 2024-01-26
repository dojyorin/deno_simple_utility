import {assertEquals, exists} from "../../deps.test.ts";
import {logEntry} from "../../src/deno_ext/log.ts";

const name = "operation";

Deno.test({
    name: "Log: Entry",
    async fn(){
        const path = `./${name}.log`;
        const log = logEntry(name, path);

        log.info("Lorem ipsum dolor sit amet.");

        const result = await exists(path, {
            isFile: true
        });

        assertEquals(result, true);

        for(const h of log.handlers){
            h.destroy();
        }
    }
});