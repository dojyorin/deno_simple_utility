import {u8Encode, u8Decode} from "./text.ts";

const sizeName = 1;
const sizeBody = 4;

/**
* Simple filename and binary pair that make up file.
*/
export type FileInit = [string, Uint8Array];

/**
* Concatenate files with "minipack" format.
* @see https://deno.land/x/simple_utility#minipack
* @example
* ```ts
* const files = [
*     ["file1", await Deno.readFile("./file1")],
*     ["file2", await Deno.readFile("./file2")]
* ];
* const encode = mpEncode(files);
* const decode = mpDecode(encode);
* ```
*/
export function mpEncode(files:FileInit[]):Uint8Array{
    const archive = new Uint8Array(files.reduce((size, [k, v]) => size + sizeName + sizeBody + u8Encode(k).byteLength + v.byteLength, 0));

    let i = 0;
    for(const [k, v] of files){
        const name = u8Encode(k);
        const body = v;

        new DataView(archive.buffer, i).setUint8(0, name.byteLength);
        i += sizeName;

        new DataView(archive.buffer, i).setUint32(0, body.byteLength);
        i += sizeBody;

        archive.set(name, i);
        i += name.byteLength;

        archive.set(body, i);
        i += body.byteLength;
    }

    return archive;
}

/**
* Decode byte array in "minipack" format.
* @see https://deno.land/x/simple_utility#minipack
* @example
* ```ts
* const files = [
*     ["file1", await Deno.readFile("./file1")],
*     ["file2", await Deno.readFile("./file2")]
* ];
* const encode = mpEncode(files);
* const decode = mpDecode(encode);
* ```
*/
export function mpDecode(archive:Uint8Array):FileInit[]{
    const files:FileInit[] = [];

    for(let i = 0; i < archive.byteLength;){
        const ns = new DataView(archive.buffer, i).getUint8(0);
        i += sizeName;

        const bs = new DataView(archive.buffer, i).getUint32(0);
        i += sizeBody;

        const name = u8Decode(archive.subarray(i, i += ns));
        const body = archive.subarray(i, i += bs);

        files.push([name, body]);
    }

    return files;
}