import {type RawWorkBook, type RawWorkSheet, type RawWorkCell, excelcp, set_cptable, sheetRead, sheetWrite, sheetUtil} from "../../deps.pure.ts";
import {timeFormatSerialize} from "../pure/time.ts";

export type {RawWorkBook, RawWorkSheet, RawWorkCell};

set_cptable(excelcp);

/**
* Convert from sheetjs raw workbook object to EXCEL workbook.
* @see https://deno.land/x/sheetjs
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = sheetDecodeRaw(bin);
* const enc = sheetEncodeRaw(book);
* ```
*/
export function sheetEncodeRaw(book:RawWorkBook, cp?:number, pw?:string):Uint8Array {
    const buf:ArrayBuffer = sheetWrite(book, {
        type: "array",
        compression: true,
        cellStyles: true,
        cellDates: true,
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
* const book = sheetDecode(bin);
* const enc = sheetEncode(book);
* ```
*/
export function sheetEncode(sheets:Record<string, string[][]>, cp?:number, pw?:string):Uint8Array {
    const book:Record<string, RawWorkSheet> = {};

    for(const [name, sheet] of Object.entries(sheets)) {
        const rows:RawWorkCell[][] = [];

        for(const row of sheet) {
            const columns:RawWorkCell[] = [];

            for(const column of row) {
                columns.push({
                    t: "s",
                    v: column
                });
            }

            rows.push(columns);
        }

        book[name] = {
            "!data": rows,
            "!ref": `A1:${sheetUtil.encode_col(rows.reduce((v, {length}) => Math.max(v, length), -Infinity))}${rows.length}`
        };
    }

    return sheetEncodeRaw({
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
* const book = sheetDecodeRaw(bin);
* const enc = sheetEncodeRaw(book);
* ```
*/
export function sheetDecodeRaw(data:Uint8Array, cp?:number, pw?:string):RawWorkBook {
    return sheetRead(data, {
        type: "array",
        dense: true,
        raw: true,
        cellStyles: true,
        cellDates: true,
        codepage: cp,
        password: pw
    });
}

/**
* Convert from EXCEL workbook to workbook object.
* @example
* ```ts
* const bin = await Deno.readFile("./book.xlsx");
* const book = sheetDecode(bin);
* const enc = sheetEncode(book);
* ```
*/
export function sheetDecode(data:Uint8Array, cp?:number, pw?:string):Record<string, string[][]> {
    const {Sheets} = sheetDecodeRaw(data, cp, pw);

    const book:Record<string, string[][]> = {};

    for(const [name, sheet] of Object.entries(Sheets)) {
        const rows:string[][] = [];

        for(const row of <(RawWorkCell[] | undefined)[]>sheet["!data"] ?? []) {
            const columns:string[] = [];

            for(const column of <(RawWorkCell | undefined)[]>row ?? []) {
                if(!column || column.t === "e" || column.v === undefined) {
                    columns.push("");
                } else if(column.v instanceof Date) {
                    column.v.setMinutes(new Date().getTimezoneOffset());
                    columns.push(timeFormatSerialize(column.v, true));
                } else {
                    columns.push(`${column.v}`);
                }
            }

            rows.push(columns);
        }

        book[name] = rows;
    }

    return structuredClone(book);
}