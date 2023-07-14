import {assertEquals} from "../deps.test.ts";
import {deepClone, deepFreeze, deepSeal} from "../src/object.ts";

const sample = {
    aaa: {
        bbb: {
            ccc: false
        }
    }
};

Deno.test({
    name: "Freeze: DeepFreeze",
    fn(){
        const freeze = deepFreeze(deepClone(sample));

        const desc = Object.getOwnPropertyDescriptor(freeze.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, false);
    }
});

Deno.test({
    name: "Freeze: DeepSeal",
    fn(){
        const seal = deepSeal(deepClone(sample));

        const desc = Object.getOwnPropertyDescriptor(seal.aaa.bbb, "ccc");
        assertEquals(desc?.configurable, false);
        assertEquals(desc?.writable, true);
    }
});