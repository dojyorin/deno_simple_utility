import {assertEquals} from "../../deps.test.ts";
import {utEncode, utDecode, utParse, delay, timeSerial} from "../../src/pure/time.ts";

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

        assertEquals(true, true);
    }
});

Deno.test({
    name: "Time: Serial",
    fn(){
        const result = timeSerial(sample);

        assertEquals(result, "20000101000000");
    }
});