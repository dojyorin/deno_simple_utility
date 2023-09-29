import {assertEquals} from "../deps.test.ts";
import {deepClone, deepFreeze, deepSeal} from "../src/deep.ts";

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
        const freeze = deepFreeze(deepClone(sample));

        const desc = Object.getOwnPropertyDescriptor(freeze.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, false);
    }
});

Deno.test({
    name: "Deep: Seal",
    fn(){
        const seal = deepSeal(deepClone(sample));

        const desc = Object.getOwnPropertyDescriptor(seal.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, true);
    }
});