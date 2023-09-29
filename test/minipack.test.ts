import {assertEquals} from "../deps.test.ts";
import {mpEncode, mpDecode} from "../src/minipack.ts";

const sampleBin = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);
const sampleName = "random.bin";

Deno.test({
    name: "Minipack: Encode and Decode",
    fn(){
        const encode = mpEncode([[sampleName, sampleBin]]);
        const [[name, body]] = mpDecode(encode);

        assertEquals(name, sampleName);
        assertEquals(body, sampleBin);
    }
});