import {assertEquals} from "../deps.test.ts";
import {base64Encode, base64Decode} from "../src/base64.ts";

const sampleByte = new Uint8Array([1, 2, 3, 4]);
const sampleCode = "AQIDBA==";

Deno.test({
    name: "Encode.",
    fn(){
        const result = base64Encode(sampleByte);

        assertEquals(result, sampleCode);
    }
});

Deno.test({
    name: "Decode.",
    fn(){
        const result = base64Encode(sampleCode);

        assertEquals(result, sampleByte);
    }
});