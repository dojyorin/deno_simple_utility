import {assertEquals} from "../deps.test.ts";
import {utfEncode, utfDecode, hexEncode, hexDecode, trimExtend, accurateSegment} from "../src/text.ts";

const sampleText = "  Lorem ipsum\r dolor   sit \t  amet. ";
const sampleBin = new Uint8Array([
    0x20, 0x20, 0x4C, 0x6F, 0x72, 0x65, 0x6D, 0x20,
    0x69, 0x70, 0x73, 0x75, 0x6D, 0x0D, 0x20, 0x64,
    0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x20, 0x20, 0x73,
    0x69, 0x74, 0x20, 0x09, 0x20, 0x20, 0x61, 0x6D,
    0x65, 0x74, 0x2E, 0x20
]);

Deno.test({
    name: "Text: UTF8 Encode and Decode",
    async fn(){
        const encode = utfEncode(sampleText);
        const decode = utfDecode(encode);

        assertEquals(decode, sampleText);
    }
});

Deno.test({
    name: "Text: HEX Encode and Decode",
    async fn(){
        const encode = hexEncode(sampleBin);
        const decode = hexDecode(encode);

        assertEquals(decode, sampleBin);
    }
});

Deno.test({
    name: "Text: Trim",
    async fn(){
        const result = trimExtend(sample);

        assertEquals(result, "Lorem ipsum dolor sit amet.");
    }
});

Deno.test({
    name: "Text: Segment",
    async fn(){
        const {length} = accurateSegment("😄😁😆😅😂");

        assertEquals(length, 5);
    }
});