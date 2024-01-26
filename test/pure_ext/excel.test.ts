import {assertEquals} from "../../deps.test.ts";
import {excelDecode, excelCell, excelTrimHead} from "../../src/pure_ext/excel.ts";

const file = await Deno.readFile(new URL(import.meta.resolve("../asset/test.xlsx")));

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