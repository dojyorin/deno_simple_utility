import {assertEquals, fromFileUrl} from "../../deps.test.ts";
import {excelDecode, excelCell, excelTrimHead} from "../../src/pure_ext/excel.ts";

function rp(p:string){
    return fromFileUrl(import.meta.resolve(p));
}

const file = await Deno.readFile(rp("./asset/test.xlsx"));

Deno.test({
    name: "EXCEL: Parse Book",
    fn(){
        const result = excelDecode(file);

        assertEquals(Object.keys(result)[0], "test");
    }
});

Deno.test({
    name: "EXCEL: Cell",
    fn(){
        const sheets = excelDecode(file);

        assertEquals(excelCell(sheets["test"][0][0]), "abc");
    }
});

Deno.test({
    name: "EXCEL: Trim Head",
    fn(){
        const sheets = excelDecode(file);

        assertEquals(excelTrimHead(sheets["test"], 1).length, 0);
    }
});