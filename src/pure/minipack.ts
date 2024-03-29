import {u8Encode, u8Decode} from "./text.ts";

const sizeName = 1;
const sizeBody = 4;

/**
* Simple name and data pair.
*/
export interface DataMap{
    name: string;
    body: Uint8Array;
}

/**
* Concatenate files with "minipack" format.
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
export function minipackEncode(files:DataMap[]):Uint8Array{
    const archive = new Uint8Array(files.reduce((size, {name, body}) => size + sizeName + sizeBody + u8Encode(name).byteLength + body.byteLength, 0));

    let i = 0;
    for(const {name, body} of files){
        const u8name = u8Encode(name);

        new DataView(archive.buffer, i).setUint8(0, u8name.byteLength);
        i += sizeName;

        new DataView(archive.buffer, i).setUint32(0, body.byteLength);
        i += sizeBody;

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
export function minipackDecode(archive:Uint8Array):DataMap[]{
    const files:DataMap[] = [];

    for(let i = 0; i < archive.byteLength;){
        const ns = new DataView(archive.buffer, i).getUint8(0);
        i += sizeName;

        const bs = new DataView(archive.buffer, i).getUint32(0);
        i += sizeBody;

        files.push({
            name: u8Decode(archive.subarray(i, i += ns)),
            body: archive.slice(i, i += bs)
        });
    }

    return files;
}