import {cryptoHash} from "./crypto.ts";
import {ucEncode, ucDecode, hexEncode} from "./text.ts";

const sizeOf = Object.freeze({
    hash: 32,
    name: 1,
    body: 4
});

const sizeTotal = Object.values(sizeOf).reduce((a, c) => a + c, 0);

/**
* Encode data into a byte array in "minipack" format.
* @param files array of pair of name and byte array.
* @return byte array in "minipack" format.
* @see https://deno.land/x/simple_utility
*/
export async function minipackEncode(files:[string, Uint8Array][]){
    const archive = new Uint8Array(files.reduce((a, [k, v]) => a + sizeTotal + ucEncode(k).byteLength + v.byteLength, 0));

    let offset = 0;

    for(const [k, v] of files){
        const name = ucEncode(k);
        const body = v;

        archive.set(await cryptoHash(true, body), offset);
        offset += sizeOf.hash;

        new DataView(archive.buffer, offset).setUint8(0, name.byteLength);
        offset += sizeOf.name;

        new DataView(archive.buffer, offset).setUint32(0, body.byteLength);
        offset += sizeOf.body;

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
    const files:[string, Uint8Array][] = [];

    let offset = 0;

    while(offset < archive.byteLength){
        const hash = archive.subarray(offset, offset += sizeOf.hash);

        const ns = new DataView(archive.buffer, offset).getUint8(0);
        offset += sizeOf.name;

        const bs = new DataView(archive.buffer, offset).getUint32(0);
        offset += sizeOf.body;

        const name = ucDecode(archive.subarray(offset, offset += ns));

        const body = archive.subarray(offset, offset += bs);

        if(hexEncode(hash) !== hexEncode(await cryptoHash(true, body))){
            throw new Error();
        }

        files.push([name, body]);
    }

    return files;
}