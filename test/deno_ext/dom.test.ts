import {assertEquals, DOMParser} from "../../deps.test.ts";
import {fetchDOM, parseDOM, collectInputById, getElementsByName, getValueById, getValuesByName, getValueByRadioActive} from "../../src/deno_ext/dom.ts";

const sample1 = "<input type='radio' id='aaa' name='aaa' value='123' checked><input type='radio' name='aaa' value='456'>";
const sample2 = new DOMParser().parseFromString(sample1, "text/html")?.documentElement;

if(!sample2){
    throw new Error();
}

Deno.test({
    name: "DOM: Fetch HTML",
    async fn(){
        const server = Deno.serve({
            hostname: "127.0.0.1",
            port: 62000,
        }, () => new Response(sample1));

        const result = await fetchDOM("http://127.0.0.1:62000");
        await server.shutdown();

        assertEquals(result.innerHTML, sample2.innerHTML);
    }
});

Deno.test({
    name: "DOM: Parse HTML",
    fn(){
        const result = parseDOM(sample1);

        assertEquals(result.innerHTML, sample2.innerHTML);
    }
});

Deno.test({
    name: "DOM: Collect input/textarea by ID",
    fn(){
        const result = collectInputById(sample2);

        assertEquals(result.aaa, "123");
    }
});

Deno.test({
    name: "DOM: Get value by ID",
    fn(){
        const result = getValueById(sample2, "aaa");

        assertEquals(result, "123");
    }
});

Deno.test({
    name: "DOM: Get element by Name",
    fn(){
        const result = getElementsByName(sample2, "aaa");

        assertEquals(result.length, 2);
    }
});

Deno.test({
    name: "DOM: Get values by Name",
    fn(){
        const result = getValuesByName(sample2, "aaa");

        assertEquals(result, ["123", "456"]);
    }
});

Deno.test({
    name: "DOM: Get value by RadioActive",
    fn(){
        const result = getValueByRadioActive(sample2, "aaa");

        assertEquals(result, "123");
    }
});