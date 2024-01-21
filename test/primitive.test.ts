import {assertEquals} from "../deps.test.ts";
import {typeDecode, typeS, typeN, typeB} from "../src/primitive.ts";

Deno.test({
    name: "Type: Decode",
    fn(){
        const result1 = typeDecode("foo", "s", true);
        const result2 = typeDecode(null, "s");

        assertEquals(result1, "foo");
        assertEquals(result2, undefined);
    }
});

Deno.test({
    name: "Type: Parse String",
    fn(){
        const result1 = typeS("foo", true);
        const result2 = typeN(null);

        assertEquals(result1, "foo");
        assertEquals(result2, undefined);
    }
});

Deno.test({
    name: "Type: Parse Number",
    fn(){
        const result1 = typeN("12345", true);
        const result2 = typeN("foo");

        assertEquals(result1, 12345);
        assertEquals(result2, undefined);
    }
});

Deno.test({
    name: "Type: Parse Boolean",
    fn(){
        const result1 = typeB("true", true);
        const result2 = typeN("foo");

        assertEquals(result1, true);
        assertEquals(result2, undefined);
    }
});