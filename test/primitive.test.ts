import {assertEquals} from "../deps.test.ts";
import {typeDecode} from "../src/primitive.ts";

Deno.test({
    name: "Type: Decode",
    fn(){
        const result1 = typeDecode("foo", "string", true);
        const result2 = typeDecode(null, "string");
        const result3 = typeDecode("12345", "number", true);
        const result4 = typeDecode("foo", "number");
        const result5 = typeDecode("true", "boolean", true);
        const result6 = typeDecode("foo", "boolean");

        assertEquals(result1, "foo");
        assertEquals(result2, undefined);
        assertEquals(result3, 12345);
        assertEquals(result4, undefined);
        assertEquals(result5, true);
        assertEquals(result6, undefined);
    }
});