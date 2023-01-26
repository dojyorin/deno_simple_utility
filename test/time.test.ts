import {assertEquals} from "../deps.test.ts";
import {unixtimeEncode, unixtimeDecode, unixtimeParse} from "../src/time.ts";

const sample = new Date(2000, 0, 1, 0, 0, 0, 0);

const encodeResult = 946684800;

Deno.test({
    name: "Date: Encode",
    async fn(){
        const result = unixtimeEncode(sample);

        assertEquals(result, encodeResult);
    }
});

Deno.test({
    name: "Date: Decode",
    async fn(){
        const result = unixtimeDecode(encodeResult);

        assertEquals(result.toISOString(), sample.toISOString());
    }
});

Deno.test({
    name: "Date: Parse",
    async fn(){
        const result = unixtimeParse(sample.toISOString());

        assertEquals(result, encodeResult);
    }
});