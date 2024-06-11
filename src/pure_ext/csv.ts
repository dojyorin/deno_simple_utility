import {parse, stringify} from "../../deps.pure.ts";
import {primitiveParseX} from "../pure/primitive.ts";

/**
* Convert from object array to CSV string.
* @see https://deno.land/std/csv
* @example
* ```ts
* const csv = csvEncode([{
*     aaa: 123,
*     bbb: true
* }]);
* ```
*/
export function csvEncode<T extends Record<keyof T, string | number | boolean>>(data:T[], bom?:boolean):string{
    return stringify(data, {
        bom: bom,
        columns: Object.keys(data[0])
    }).replace(/\r/g, "").trim();
}

/**
* Convert from CSV string to object array.
* If parsing failed of cell value use default (`def`) value.
* Convert to same type as default value.
* @see https://deno.land/std/csv
* @example
* ```ts
* const list = csvDecode("aaa,bbb\n123,true", {
*     aaa: 0,
*     bbb: false
* });
* ```
*/
export function csvDecode<T extends Record<keyof T, string | number | boolean>>(data:string, def:T):T[]{
    const csv = parse(data, {
        skipFirstRow: true,
        trimLeadingSpace: true
    });

    const records:T[] = [];

    for(const element of csv){
        const props:Partial<T> = {};
        type K = keyof T;

        for(const [k, v] of Object.entries(element)){
            props[<K>k] = <T[K]>primitiveParseX(v, def[<K>k]);
        }

        records.push(structuredClone(<T>props));
    }

    return records;
}