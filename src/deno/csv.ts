import {parse, stringify} from "../../deps.ts";
import {deepClone} from "../pure/deep.ts";
import {primitiveParseX} from "../pure/primitive.ts";

/**
* Object containing string, number, or boolean.
*/
export type OptCSV<T> = Record<keyof T, string | number | boolean>;

/**
* Convert from object array to CSV string.
* @example
* ```ts
* const csv = csvEncode([{
*     aaa: 123,
*     bbb: true
* }]);
* ```
*/
export function csvEncode<T extends OptCSV<T>>(data:T[], bom?:boolean):string{
    return stringify(data, {
        bom: bom,
        columns: Object.keys(data[0])
    });
}

/**
* Convert from CSV string to object array.
* If cannot be parsed cell value, use default (`def`) value.
* Convert to same type as default value.
* @example
* ```ts
* const list = csvDecode("aaa,bbb\n123,true", {
*     aaa: 0,
*     bbb: false
* });
* ```
*/
export function csvDecode<T extends OptCSV<T>>(data:string, def:T):T[]{
    const csv = parse(data, {
        skipFirstRow: true,
        trimLeadingSpace: true
    });

    const records:T[] = [];

    for(const element of csv){
        const props:Partial<T> = {};
        type K = keyof T;

        for(const k in element){
            props[<K>k] = <T[K]>primitiveParseX(element[k], def[<K>k]);
        }

        records.push(deepClone(<T>props));
    }

    return records;
}