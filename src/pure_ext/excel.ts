import {excel, excelcp} from "../../deps.pure_ext.ts";

excel.set_cptable(excelcp);

/**
* Convert from workbook object to EXCEL workbook.
* @see https://deno.land/x/sheetjs
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecode(bin);
* const enc = excelEncode(book);
* ```
*/
export function excelEncode(sheets:Record<string, string[][]>, cp?:number, pw?:string):Uint8Array{
    const buf = <ArrayBuffer>excel.write({
        SheetNames: Object.keys(sheets),
        Sheets: {
            "a": {
                "!data": [[{t: "s", w: ""}]]
            }
        }
    }, {
        type: "array",
        compression: true,
        codepage: cp,
        password: pw
    });

    return new Uint8Array(buf);
}

/**
* Convert from EXCEL workbook to workbook object.
* @see https://deno.land/x/sheetjs
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecode(bin);
* const enc = excelEncode(book);
* ```
*/
export function excelDecode(data:Uint8Array, cp?:number, pw?:string):Record<string, string[][]>{
    const {Sheets} = excel.read(data, {
        type: "array",
        dense: true,
        raw: true,
        codepage: cp,
        password: pw
    });

    const sheets:Record<string, string[][]> = {};

    for(const [name, sheet] of Object.entries(Sheets)){
        const rows:string[][] = [];

        for(const row of sheet["!data"] ?? []){
            const cells:string[] = [];

            for(const cell of row){
                cells.push(cell?.t === "e" ? "" : cell?.w ?? "");
            }

            rows.push(cells);
        }
    }

    return sheets;
}