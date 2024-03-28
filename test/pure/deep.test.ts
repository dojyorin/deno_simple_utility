import {assertEquals} from "../../deps.test.ts";
import {deepFreeze, deepSeal} from "../../src/pure/deep.ts";

const sample = {
    aaa: {
        bbb: {
            ccc: false
        }
    }
};

Deno.test({
    name: "Deep: Freeze",
    fn(){
        const freeze = deepFreeze(structuredClone(sample));

        const desc = Object.getOwnPropertyDescriptor(freeze.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, false);
    }
});

Deno.test({
    name: "Deep: Seal",
    fn(){
        const seal = deepSeal(structuredClone(sample));

        const desc = Object.getOwnPropertyDescriptor(seal.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, true);
    }
});