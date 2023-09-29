import {assertEquals} from "../deps.test.ts";
import {u8Encode, u8Decode, hexEncode, hexDecode, trimExtend, fixWidth, cleanText, accurateSegment, pad0} from "../src/text.ts";

const sampleText = "  Lorem ipsum\r dolor   sit  \r\r amet. ";
const sampleBin = new Uint8Array([
    0x20, 0x20, 0x4C, 0x6F, 0x72, 0x65, 0x6D, 0x20,
    0x69, 0x70, 0x73, 0x75, 0x6D, 0x0D, 0x20, 0x64,
    0x6F, 0x6C, 0x6F, 0x72, 0x20, 0x20, 0x20, 0x73,
    0x69, 0x74, 0x20, 0x09, 0x20, 0x20, 0x61, 0x6D,
    0x65, 0x74, 0x2E, 0x20
]);

Deno.test({
    name: "Text: UTF8 Encode and Decode",
    fn(){
        const encode = u8Encode(sampleText);
        const decode = u8Decode(encode);

        assertEquals(decode, sampleText);
    }
});

Deno.test({
    name: "Text: HEX Encode and Decode",
    fn(){
        const encode = hexEncode(sampleBin);
        const decode = hexDecode(encode);

        assertEquals(decode, sampleBin);
    }
});

Deno.test({
    name: "Text: Trim",
    fn(){
        const result = trimExtend(sampleText);

        assertEquals(result, "Lorem ipsum dolor sit amet.");
    }
});

Deno.test({
    name: "Text: Fix Width",
    fn(){
        const result = fixWidth("１＋１＝２");

        assertEquals(result, "1+1=2");
    }
});

Deno.test({
    name: "Text: Clean Up",
    fn(){
        const result = cleanText("１  ＋  １  ＝  ２  ");

        assertEquals(result, "1 + 1 = 2");
    }
});

Deno.test({
    name: "Text: Segment",
    fn(){
        const {length} = accurateSegment("😄😁😆😅😂");

        assertEquals(length, 5);
    }
});

Deno.test({
    name: "Text: Pad 0",
    fn(){
        const pad = pad0(8);

        assertEquals(pad, "08");
    }
});