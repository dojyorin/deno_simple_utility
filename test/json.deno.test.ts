import {assertEquals} from "../deps.test.ts";
import {jsonRead, jsonWrite, jsonLoad, configLoad} from "../src/json.deno.ts";

const object = <const>{
    id: "22d8b040-8a63-46a0-8df6-0f508a778689",
    name: "Malinda Wolfe",
    company: "AUSTECH",
    email: "malindawolfe@austech.com"
};

Deno.test({
    name: "JSON: Read and Write",
    async fn(){
        const path = "./output.json";

        await jsonWrite(path, object);
        const result = await jsonRead(path);

        assertEquals(result, object);
    }
});

Deno.test({
    name: "JSON: Load and Config",
    async fn(){
        const path = "./resource.json";

        const result01 = await jsonLoad(path, object);
        const result02 = await configLoad(object);
        assertEquals(result01, object);
        assertEquals(result02, object);

        const modify = structuredClone(object);
        modify.name = "Ninja Slayer";

        const result11 = await jsonLoad(path, modify);
        const result12 = await configLoad(modify);
        assertEquals(result11, object);
        assertEquals(result12, object);
    }
});