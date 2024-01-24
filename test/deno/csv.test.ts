import {assertEquals} from "../../deps.test.ts";
import {csvEncode, csvDecode} from "../../src/deno/csv.ts";

const sample = [{
    foo: 123,
    bar: true,
    baz: "cat"
}, {
    foo: 456,
    bar: false,
    baz: "dog"
}];

Deno.test({
    name: "CSV: Encode and Decode",
    fn(){
        const encode = csvEncode(sample);
        const decode = csvDecode<typeof sample[number]>(encode, {
            foo: 0,
            bar: false,
            baz: ""
        });

        assertEquals(decode, sample);
    }
});