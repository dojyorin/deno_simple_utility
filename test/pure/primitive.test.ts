import {assertEquals} from "../../deps.test.ts";
import {primitiveParse, primitiveParseX} from "../../src/pure/primitive.ts";

Deno.test({
    name: "Primitive: Parse",
    fn() {
        const result1 = primitiveParse("foo", "string", true);
        const result2 = primitiveParse(null, "string");
        const result3 = primitiveParse("12345", "number", true);
        const result4 = primitiveParse("foo", "number");
        const result5 = primitiveParse("true", "boolean", true);
        const result6 = primitiveParse("foo", "boolean");

        assertEquals(result1, "foo");
        assertEquals(result2, undefined);
        assertEquals(result3, 12345);
        assertEquals(result4, NaN);
        assertEquals(result5, true);
        assertEquals(result6, false);
    }
});

Deno.test({
    name: "Primitive: ParseX",
    fn() {
        const result1 = primitiveParseX("foo", "");
        const result2 = primitiveParseX("123", 0);
        const result3 = primitiveParseX("true", false);

        assertEquals(result1, "foo");
        assertEquals(result2, 123);
        assertEquals(result3, true);
    }
});