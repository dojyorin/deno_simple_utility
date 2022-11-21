import {assertEquals} from "../deps.test.ts";
import {dateEncode, dateDecode} from "../src/date.ts";

const sample = new Date(2000, 0, 1, 0, 0, 0, 0);

const encodeResult = 946684800;

Deno.test({
    name: "Date: Encode",
    async fn(){
        const result = await dateEncode(sample);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Date: Decode",
    async fn(){
        const result = await dateDecode(encodeResult);

        assertEquals(result.toISOString(), sample.toISOString());
    }
});