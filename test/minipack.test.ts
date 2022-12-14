import {assertEquals} from "../deps.test.ts";
import {minipackEncode, minipackDecode} from "../src/minipack.ts";

const sample = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);
const fileName = "random.bin";

const encodeResult = new Uint8Array([
    0x66, 0x7F, 0x71, 0xE5, 0x52, 0x03, 0xB5, 0xCE,
    0xD3, 0x51, 0xAA, 0xFE, 0x64, 0xAA, 0xA9, 0xCE,
    0x9B, 0xC0, 0x0D, 0x0E, 0x35, 0xEF, 0x7D, 0x88,
    0x20, 0x8F, 0x9D, 0x4A, 0x58, 0x5D, 0x50, 0xA9,
    0x0A, 0x00, 0x00, 0x00, 0x08, 0x72, 0x61, 0x6E,
    0x64, 0x6F, 0x6D, 0x2E, 0x62, 0x69, 0x6E, 0x02,
    0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F
]);

Deno.test({
    name: "Minipack: Encode",
    async fn(){
        const result = await minipackEncode([
            [fileName, sample]
        ]);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Minipack: Decode",
    async fn(){
        const [[name, body]] = await minipackDecode(encodeResult);

        assertEquals(name, fileName);
        assertEquals(body, sample);
    }
});