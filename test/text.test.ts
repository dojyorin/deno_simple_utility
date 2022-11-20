import {assertEquals} from "../deps.test.ts";
import {textEncode, textDecode, trimExtend} from "../src/text.ts";

const sample = "  Lorem ipsum\r dolor   sit \t  amet. ";

const encodeResult = new Uint8Array([
    0x20, 0x20, 0x4C, 0x6F, 0x72, 0x65, 0x6D, 0x20,
    0x69, 0x70, 0x73, 0x75, 0x6D, 0x0D, 0x20, 0x64,
    0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x20, 0x20, 0x73,
    0x69, 0x74, 0x20, 0x09, 0x20, 0x20, 0x61, 0x6D,
    0x65, 0x74, 0x2E, 0x20
]);

const trimResult = "Lorem ipsum dolor sit amet.";

Deno.test({
    name: "Text: Encode.",
    async fn(){
        const result = await textEncode(sample);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Text: Decode.",
    async fn(){
        const result = await textDecode(encodeResult);

        assertEquals(result, sample);
    }
});

Deno.test({
    name: "Text: Trim.",
    async fn(){
        const result = await trimExtend(sample);

        assertEquals(result, trimResult);
    }
});