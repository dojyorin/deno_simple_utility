import {assertEquals} from "../deps.test.ts";
import {trimExtend} from "../src/text.ts";

const sample = "  Lorem ipsum\r dolor   sit \t  amet. ";

const encodeResult = "Lorem ipsum dolor sit amet.";

Deno.test({
    name: "Text: Trim",
    async fn(){
        const result = await trimExtend(sample);

        assertEquals(result, encodeResult);
    }
});