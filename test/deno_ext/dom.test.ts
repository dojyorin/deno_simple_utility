import {assertEquals, DOMParser} from "../../deps.test.ts";
import {domDecode, domValuesPerId, domValueById, domElementsByName, domValuesByName, domValueByRadioActive} from "../../src/deno_ext/dom.ts";

const sample1 = "<input type='radio' id='aaa' name='aaa' value='123' checked><input type='radio' name='aaa' value='456'>";
const sample2 = new DOMParser().parseFromString(sample1, "text/html")?.documentElement;

if(!sample2){
    throw new Error();
}

Deno.test({
    name: "DOM: Parse HTML",
    fn(){
        const result = domDecode(sample1);

        assertEquals(result.innerHTML, sample2.innerHTML);
    }
});

Deno.test({
    name: "DOM: Collect input/textarea by ID",
    fn(){
        const result = domValuesPerId(sample2);

        assertEquals(result.aaa, "123");
    }
});

Deno.test({
    name: "DOM: Get value by ID",
    fn(){
        const result = domValueById(sample2, "aaa");

        assertEquals(result, "123");
    }
});

Deno.test({
    name: "DOM: Get element by Name",
    fn(){
        const result = domElementsByName(sample2, "aaa");

        assertEquals(result.length, 2);
    }
});

Deno.test({
    name: "DOM: Get values by Name",
    fn(){
        const result = domValuesByName(sample2, "aaa");

        assertEquals(result, ["123", "456"]);
    }
});

Deno.test({
    name: "DOM: Get value by RadioActive",
    fn(){
        const result = domValueByRadioActive(sample2, "aaa");

        assertEquals(result, "123");
    }
});