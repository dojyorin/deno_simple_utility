import {type FileInit} from "./core.d.ts";
import {cryptoHash} from "./crypto.ts";
import {ucEncode, ucDecode, hexEncode} from "./text.ts";

const sizeHash = 32;
const sizeName = 1;
const sizeBody = 4;
const sizeTotal = sizeHash + sizeName + sizeBody;

/**
* Encode data into a byte array in "minipack" format.
* @param files array of pair of name and byte array.
* @return byte array in "minipack" format.
* @see https://deno.land/x/simple_utility
*/
export async function minipackEncode(files:FileInit[]){
    const archive = new Uint8Array(files.reduce((a, [k, v]) => a + sizeTotal + ucEncode(k).byteLength + v.byteLength, 0));

    let offset = 0;

    for(const [k, v] of files){
        const name = ucEncode(k);
        const body = v;

        archive.set(await cryptoHash(false, body), offset);
        offset += sizeHash;

        new DataView(archive.buffer, offset).setUint8(0, name.byteLength);
        offset += sizeName;

        new DataView(archive.buffer, offset).setUint32(0, body.byteLength);
        offset += sizeBody;

        archive.set(name, offset);
        offset += name.byteLength;

        archive.set(body, offset);
        offset += body.byteLength;
    }

    return archive;
}

/**
* Decode byte array in "minipack" format.
* @param archive byte array in "minipack" format.
* @return array of pair of name and byte array.
* @see https://deno.land/x/simple_utility
*/
export async function minipackDecode(archive:Uint8Array){
    const files:FileInit[] = [];

    let offset = 0;

    while(offset < archive.byteLength){
        const hash = archive.subarray(offset, offset += sizeHash);

        const ns = new DataView(archive.buffer, offset).getUint8(0);
        offset += sizeName;

        const bs = new DataView(archive.buffer, offset).getUint32(0);
        offset += sizeBody;

        const name = ucDecode(archive.subarray(offset, offset += ns));

        const body = archive.subarray(offset, offset += bs);

        if(hexEncode(hash) !== hexEncode(await cryptoHash(false, body))){
            throw new Error();
        }

        files.push([name, body]);
    }

    return files;
}