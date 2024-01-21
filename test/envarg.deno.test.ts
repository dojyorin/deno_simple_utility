import {assertEquals} from "../deps.test.ts";
import {envGet} from "../src/envarg.deno.ts";

Deno.env.set("TEST_ENV_1", "abc");
Deno.env.set("TEST_ENV_2", "123");
Deno.env.set("TEST_ENV_3", "true");

Deno.test({
    name: "Env: Get",
    fn(){
        const env1 = envGet("TEST_ENV_1", "string", true);
        const env2 = envGet("TEST_ENV_2", "number", true);
        const env3 = envGet("TEST_ENV_3", "boolean", true);

        assertEquals(env1, "abc");
        assertEquals(env2, 123);
        assertEquals(env3, true);
    }
});