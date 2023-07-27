import {assertEquals} from "../deps.test.ts";
import {blobConvert} from "../src/blob.ts";

const sample = "hello!";

Deno.test({
    name: "Blob: Convert",
    async fn(){
        const data = await blobConvert(new Blob([sample]), "text");

        assertEquals(data, sample);
    }
});