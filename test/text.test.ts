import {assertEquals} from "../deps.test.ts";
import {utfEncode, utfDecode, hexEncode, hexDecode, trimExtend, accurateSegment} from "../src/text.ts";

const sample = "  Lorem ipsum\r dolor   sit \t  amet. ";
const sampleHEX = "20204C6F72656D20697073756D0D20646F6C6F7220202073697420092020616D65742E20";
const sampleUTF8 = new Uint8Array([
    0x20, 0x20, 0x4C, 0x6F, 0x72, 0x65, 0x6D, 0x20,
    0x69, 0x70, 0x73, 0x75, 0x6D, 0x0D, 0x20, 0x64,
    0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x20, 0x20, 0x73,
    0x69, 0x74, 0x20, 0x09, 0x20, 0x20, 0x61, 0x6D,
    0x65, 0x74, 0x2E, 0x20
]);

const encodeResult = "Lorem ipsum dolor sit amet.";

Deno.test({
    name: "Text: UTF8 Encode",
    async fn(){
        const result = utfEncode(sample);

        assertEquals(result, sampleUTF8);
    }
});

Deno.test({
    name: "Text: UTF8 Decode",
    async fn(){
        const result = utfDecode(sampleUTF8);

        assertEquals(result, sample);
    }
});

Deno.test({
    name: "Text: HEX Encode",
    async fn(){
        const result = hexEncode(sampleUTF8);

        assertEquals(result, sampleHEX);
    }
});

Deno.test({
    name: "Text: HEX Decode",
    async fn(){
        const result = hexDecode(sampleHEX);

        assertEquals(result, sampleUTF8);
    }
});

Deno.test({
    name: "Text: Trim",
    async fn(){
        const result = trimExtend(sample);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Text: Segment",
    async fn(){
        const result = accurateSegment("😄😁😆😅😂");

        assertEquals(result.length, 5);
    }
});