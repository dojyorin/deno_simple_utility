import {type WorkBook, type WorkSheet, type CellObject, xlsxcp, set_cptable, xlsxRead, xlsxWrite, xlsxUtil} from "../../deps.pure_ext.ts";
import {deepClone} from "../pure/deep.ts";

export type {WorkBook as RawWorkBook, WorkSheet as RawWorkSheet, CellObject as RawWorkCell};

set_cptable(xlsxcp);

/**
* Convert from sheetjs raw workbook object to EXCEL workbook.
* @see https://deno.land/x/sheetjs
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecodeRaw(bin);
* const enc = excelEncodeRaw(book);
* ```
*/
export function excelEncodeRaw(book:WorkBook, cp?:number, pw?:string):Uint8Array{
    const buf = <ArrayBuffer>xlsxWrite(book, {
        type: "array",
        compression: true,
        codepage: cp,
        password: pw
    });

    return new Uint8Array(buf);
}

/**
* Convert from workbook object to EXCEL workbook.
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecode(bin);
* const enc = excelEncode(book);
* ```
*/
export function excelEncode(sheets:Record<string, string[][]>, cp?:number, pw?:string):Uint8Array{
    const book:Record<string, WorkSheet> = {};

    for(const [name, sheet] of Object.entries(sheets)){
        const rows:CellObject[][] = [];

        for(const row of sheet){
            const columns:CellObject[] = [];

            for(const column of row){
                columns.push({
                    t: "s",
                    v: column
                });
            }

            rows.push(columns);
        }

        book[name] = {
            "!data": rows,
            "!ref": `A1:${xlsxUtil.encode_col(rows.reduce((v, {length}) => Math.max(v, length), -Infinity))}${rows.length}`
        };
    }

    return excelEncodeRaw({
        SheetNames: Object.keys(sheets),
        Sheets: book
    }, cp, pw);
}

/**
* Convert from EXCEL workbook to sheetjs raw workbook object.
* @see https://deno.land/x/sheetjs
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecodeRaw(bin);
* const enc = excelEncodeRaw(book);
* ```
*/
export function excelDecodeRaw(data:Uint8Array, cp?:number, pw?:string):WorkBook{
    return xlsxRead(data, {
        type: "array",
        dense: true,
        raw: true,
        codepage: cp,
        password: pw
    });
}

/**
* Convert from EXCEL workbook to workbook object.
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecode(bin);
* const enc = excelEncode(book);
* ```
*/
export function excelDecode(data:Uint8Array, cp?:number, pw?:string):Record<string, string[][]>{
    const {Sheets} = excelDecodeRaw(data, cp, pw);

    const book:Record<string, string[][]> = {};

    for(const [name, sheet] of Object.entries(Sheets)){
        const rows:string[][] = [];

        for(const row of sheet["!data"] ?? []){
            const columns:string[] = [];

            for(const {t, w} of row){
                columns.push(t === "e" ? "" : w ?? "");
            }

            rows.push(columns);
        }

        book[name] = rows;
    }

    return deepClone(book);
}