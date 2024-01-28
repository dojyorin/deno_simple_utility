import {assertEquals, exists} from "../../deps.test.ts";
import {logEntry} from "../../src/deno_ext/log.ts";

const name = "operation";
const path = `./${name}.log`;

Deno.test({
    name: "Log: Entry",
    async fn(){
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