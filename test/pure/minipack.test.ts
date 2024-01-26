import {assertEquals} from "../../deps.test.ts";
import {mpEncode, mpDecode} from "../../src/pure/minipack.ts";

const samples = [{
    name: "random.bin",
    body: new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F])
}];

Deno.test({
    name: "Minipack: Encode and Decode",
    fn(){
        const encode = mpEncode(samples);
        const decode = mpDecode(encode);

        assertEquals(decode, samples);
    }
});