import {excel, excelcp} from "../../deps.pure_ext.ts";
import {cleanText} from "../pure/text.ts";

excel.set_cptable(excelcp);

/**
* Parameters of worksheet cell.
* @see https://deno.land/x/sheetjs/types/index.d.ts?doc=&s=CellObject
*/
export type EXCELCell = excel.CellObject;

/**
* Matrix of cells in worksheet.
*/
export type EXCELSheet = (EXCELCell | undefined)[][];

/**
* Converted workbook object.
*/
export type EXCELBook = Record<string, EXCELSheet>;

/**
* Convert from EXCEL format workbook to object.
* @see https://deno.land/x/sheetjs/types/index.d.ts?doc=&s=read
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = excelDecode(bin);
* ```
*/
export function excelDecode(book:Uint8Array):EXCELBook{
    const {Sheets} = excel.read(book, {
        type: "array",
        codepage: 932,
        dense: true,
        raw: true
    });

    return <EXCELBook>Object.fromEntries(Object.entries(Sheets).map(([k, v]) => [k, v["!data"]]));
}

/**
* Extract string from `EXCELCell`.
* Error cells are converted to empty string.
* Whitespaces and tabs are trimmed.
* @example
* ```ts
* const {sheets} = await excelRead("./book.xlsx");
* const text = excelCell(sheets["sheet1"][0][0]);
* ```
*/
export function excelCell(cell?:EXCELCell):string{
    return cell?.t === "e" ? "" : cleanText(cell?.w ?? "");
}

/**
* Remove header from `EXCELSheet`.
* @example
* ```ts
* const {sheets} = await excelRead("./book.xlsx");
* const sheet = excelHead(sheets["sheet1"], 3);
* ```
*/
export function excelTrimHead(sheet:EXCELSheet, count:number):EXCELSheet{
    return sheet.toSpliced(0, count);
}