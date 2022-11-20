import {textEncode, textDecode} from "./text.ts";

const size = <const>{
    hash: 32,
    name: 1,
    body: 4
};

const sizeTotal = Object.values(size).reduce((a, c) => a + c, 0);

async function hashEncode(data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

/**
* Convert from array of file object to "minipack" archive format.
* @see https://deno.land/x/simple_utility
* @param files Array of file objects.
*/
export async function minipackEncode(files:File[]){
    const archive = new Uint8Array(files.reduce((a, {size: s, name: n}) => a + sizeTotal + textEncode(n).byteLength + s, 0));

    let offset = 0;

    for(const file of files){
        const name = textEncode(file.name);
        const body = new Uint8Array(await file.arrayBuffer());

        archive.set(await hashEncode(body), offset);
        offset += size.hash;

        new DataView(archive.buffer, offset).setUint8(0, name.byteLength);
        offset += size.name;

        new DataView(archive.buffer, offset).setUint32(0, body.byteLength);
        offset += size.body;

        archive.set(name, offset);
        offset += name.byteLength;

        archive.set(body, offset);
        offset += body.byteLength;
    }

    return archive;
}

/**
* Convert from binary in "minipack" archive format to file object array.
* @see https://deno.land/x/simple_utility
* @param archive The byte array.
*/
export async function minipackDecode(archive:Uint8Array){
    const files:File[] = [];

    let offset = 0;

    while(offset < archive.byteLength){
        const hash = archive.subarray(offset, offset += size.hash);

        const ns = new DataView(archive.buffer, offset).getUint8(0);
        offset += size.name;

        const bs = new DataView(archive.buffer, offset).getUint32(0);
        offset += size.body;

        const name = textDecode(archive.subarray(offset, offset += ns));

        const body = archive.subarray(offset, offset += bs);

        if(hash.toString() !== (await hashEncode(body)).toString()){
            throw new Error();
        }

        files.push(new File([body], name));
    }

    return files;
}