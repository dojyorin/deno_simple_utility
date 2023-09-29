import {assertEquals} from "../deps.test.ts";
import {blobConvert, byteConcat} from "../src/byte.ts";

const sample = "hello!";

Deno.test({
    name: "Byte: Blob Convert",
    async fn(){
        const data = await blobConvert(new Blob([sample]), "text");

        assertEquals(data, sample);
    }
});

Deno.test({
    name: "Byte: Concat",
    fn(){
        const data = byteConcat(new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]));

        assertEquals(data, new Uint8Array([1, 2, 3, 4, 5, 6]));
    }
});