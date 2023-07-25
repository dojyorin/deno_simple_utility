import {assertEquals} from "../deps.test.ts";
import {importAssert} from "../src/import.ts";

const expect = <const>{
    assert: {
        type: "json"
    }
};

Deno.test({
    name: "Import: Assert Option",
    fn(){
        const option = importAssert();

        assertEquals(option, expect);
    }
});