import {assertEquals} from "../../deps.test.ts";
import {byteConcat} from "../../src/pure/byte.ts";

Deno.test({
    name: "Byte: Concat",
    fn(){
        const data = byteConcat(new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]));

        assertEquals(data, new Uint8Array([1, 2, 3, 4, 5, 6]));
    }
});