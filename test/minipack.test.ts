import {assertEquals} from "../deps.test.ts";
import {minipackEncode, minipackDecode} from "../src/minipack.ts";

const sampleBin = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);
const sampleName = "random.bin";

Deno.test({
    name: "Minipack: Encode and Decode",
    fn(){
        const encode = minipackEncode([[sampleName, sampleBin]]);
        const [[name, body]] = minipackDecode(encode);

        assertEquals(name, sampleName);
        assertEquals(body, sampleBin);
    }
});