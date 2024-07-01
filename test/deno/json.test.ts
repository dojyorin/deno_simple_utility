import {assertEquals} from "../../deps.test.ts";
import {jsonRead, jsonWrite, jsonLoad} from "../../src/deno/json.ts";

const object = {
    id: "22d8b040-8a63-46a0-8df6-0f508a778689",
    name: "Malinda Wolfe",
    company: "AUSTECH",
    email: "malindawolfe@austech.com"
};

Deno.test({
    name: "JSON: Read and Write",
    async fn() {
        const path = "./output.json";

        await jsonWrite(path, object);
        const result = await jsonRead(path);

        assertEquals(result, object);
    }
});

Deno.test({
    name: "JSON: Load and Config",
    async fn() {
        const path = "./resource.json";

        const result1 = await jsonLoad(path, object);
        assertEquals(result1, object);

        const modify = structuredClone(object);
        modify.name = "Ninja Slayer";

        const result2 = await jsonLoad(path, modify);
        assertEquals(result2, object);
    }
});