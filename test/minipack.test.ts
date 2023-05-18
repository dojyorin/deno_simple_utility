import {assertEquals} from "../deps.test.ts";
import {minipackEncode, minipackDecode} from "../src/minipack.ts";

const sample = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);
const fileName = "random.bin";

const encodeResult = new Uint8Array([
    0x0A, 0x00, 0x00, 0x00, 0x08, 0x72, 0x61, 0x6E,
    0x64, 0x6F, 0x6D, 0x2E, 0x62, 0x69, 0x6E, 0x02,
    0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F
]);

Deno.test({
    name: "Minipack: Encode",
    fn(){
        const result = minipackEncode([
            [fileName, sample]
        ]);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Minipack: Decode",
    fn(){
        const [[name, body]] = minipackDecode(encodeResult);

        assertEquals(name, fileName);
        assertEquals(body, sample);
    }
});