import {assertEquals} from "../../deps.test.ts";
import {delay, timeEncode, timeDecode, timeFormatSerialize} from "../../src/pure/time.ts";

const sample = new Date(2000, 0, 1, 0, 0, 0, 0);

Deno.test({
    name: "Time: Encode and Decode",
    fn() {
        const encode = timeEncode(sample);
        const decode = timeDecode(encode);

        assertEquals(decode, sample);
    }
});

Deno.test({
    name: "Time: Delay",
    async fn() {
        await delay(100);

        assertEquals(true, true);
    }
});

Deno.test({
    name: "Time: Serial",
    fn() {
        const result = timeFormatSerialize(sample);

        assertEquals(result, "20000101000000");
    }
});