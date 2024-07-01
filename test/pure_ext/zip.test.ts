import {assertEquals} from "../../deps.test.ts";
import {zipEncode, zipDecode} from "../../src/pure_ext/zip.ts";

const sample = [{
    name: "zip.ts",
    body: await Deno.readFile(new URL(import.meta.url))
}];

Deno.test({
    name: "ZIP: Encode and Decode",
    async fn() {
        const encode = await zipEncode(sample);
        const decode = await zipDecode(encode);

        assertEquals(decode, sample);
    }
});