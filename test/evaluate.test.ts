import {assertEquals} from "../deps.test.ts";
import {type DefExp, evaluateESM} from "../src/evaluate.ts";

Deno.test({
    name: "Evaluate: ESM",
    async fn(){
        const {default: esm} = await evaluateESM<DefExp<string>>("export default 'hello!';");

        assertEquals(esm, "hello!");
    }
});