import {assertEquals, serve} from "../deps.test.ts";
import {fetchExtend} from "../src/fetch.ts";

const sample = new Uint8Array([
    0x71, 0xD6, 0xFB, 0x3D, 0xF9, 0xD9, 0x41, 0x07,
    0x38, 0x4D, 0xC9, 0x72, 0xE4, 0xA5, 0x63, 0x37,
    0xD6, 0x8D, 0x12, 0x75, 0x08, 0x62, 0xA1, 0xB6,
    0xAC, 0x3B, 0xEC, 0x12, 0x5A, 0xBF, 0x4F, 0x3B
]);

Deno.test({
    name: "Fetch: Get",
    async fn(){
        const ac = new AbortController();

        serve(() => new Response(sample), {
            hostname: "127.0.0.1",
            port: 62000,
            signal: ac.signal
        });

        const result = await fetchExtend("http://127.0.0.1:62000", "byte");

        assertEquals(result, sample);

        ac.abort();
    }
});