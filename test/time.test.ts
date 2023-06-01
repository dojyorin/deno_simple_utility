import {assertEquals} from "../deps.test.ts";
import {unixtimeEncode, unixtimeDecode, unixtimeParse} from "../src/time.ts";

const sample = new Date(2000, 0, 1, 0, 0, 0, 0);

Deno.test({
    name: "Date: Encode and Decode",
    async fn(){
        const encode = unixtimeEncode(sample);
        const decode = unixtimeDecode(encode);

        assertEquals(decode, sample);
    }
});

Deno.test({
    name: "Date: Parse",
    async fn(){
        const result = unixtimeParse(sample.toISOString());

        assertEquals(result, 946684800);
    }
});