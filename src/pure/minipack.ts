import {textEncode, textDecode} from "./text.ts";

const NAME_SIZE = 1;
const BODY_SIZE = 4;

/**
* Simple name and body pair.
*/
export interface DataEntry {
    name: string;
    body: Uint8Array;
}

/**
* Concat files with "minipack" format.
* @see https://deno.land/x/simple_utility#minipack
* @example
* ```ts
* const files = [{
*     name: "foo.txt",
*     body: await Deno.readFile("./foo.txt")
* }];
* const encode = minipackEncode(files);
* const decode = minipackDecode(encode);
* ```
*/
export function minipackEncode(files: DataEntry[]): Uint8Array {
    const archive = new Uint8Array(files.reduce((size, {name, body}) => size + NAME_SIZE + BODY_SIZE + textEncode(name).byteLength + body.byteLength, 0));

    let i = 0;
    for(const {name, body} of files) {
        const u8name = textEncode(name);

        new DataView(archive.buffer, i).setUint8(0, u8name.byteLength);
        i += NAME_SIZE;

        new DataView(archive.buffer, i).setUint32(0, body.byteLength);
        i += BODY_SIZE;

        archive.set(u8name, i);
        i += u8name.byteLength;

        archive.set(body, i);
        i += body.byteLength;
    }

    return archive;
}

/**
* Decode binary of "minipack" format.
* @see https://deno.land/x/simple_utility#minipack
* @example
* ```ts
* const files = [{
*     name: "foo.txt",
*     body: await Deno.readFile("./foo.txt")
* }];
* const encode = minipackEncode(files);
* const decode = minipackDecode(encode);
* ```
*/
export function minipackDecode(archive: Uint8Array): DataEntry[] {
    const files: DataEntry[] = [];

    for(let i = 0; i < archive.byteLength;) {
        const ns = new DataView(archive.buffer, i).getUint8(0);
        i += NAME_SIZE;

        const bs = new DataView(archive.buffer, i).getUint32(0);
        i += BODY_SIZE;

        files.push({
            name: textDecode(archive.subarray(i, i += ns)),
            body: archive.slice(i, i += bs)
        });
    }

    return files;
}