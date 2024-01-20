import {assertEquals} from "../deps.test.ts";
import {utEncode, utDecode, utParse, delay} from "../src/time.ts";

const sample = new Date(2000, 0, 1, 0, 0, 0, 0);

Deno.test({
    name: "Time: Encode and Decode",
    fn(){
        const encode = utEncode(sample);
        const decode = utDecode(encode);

        assertEquals(decode, sample);
    }
});

Deno.test({
    name: "Time: Parse",
    fn(){
        const result = utParse(sample.toISOString());

        assertEquals(result, 946684800);
    }
});

Deno.test({
    name: "Time: Delay",
    async fn(){
        await delay(100);
    }
});