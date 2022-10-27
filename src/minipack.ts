const size = <const>{
    hash: 32,
    name: 1,
    body: 4
};

const sizeTotal = Object.values(size).reduce((a, c) => a + c, 0);

async function sha2(data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

function s2b(data:string){
    return new TextEncoder().encode(data);
}

function b2s(data:Uint8Array){
    return new TextDecoder().decode(data);
}

/**
* Converts an array of file objects to the 'minipack' archive format.
*
* The structure of "minipack" is very simple, and it was inspired by "tar".
*
* The header consists of "4-byte size definition", "32-byte SHA256 hash" and "256-byte file name",
* and the data body is embedded immediately after the header.
*
* This combination of header + body is repeated for the number of files.
*
* In favor of simplicity, advanced features such as directories and permissions are not supported.
* @param files Array of file objects.
**/
export async function minipackEncode(files:File[]){
    const archive = new Uint8Array(files.reduce((a, {size: s, name: n}) => a + sizeTotal + s2b(n).byteLength + s, 0));

    let offset = 0;

    for(const file of files){
        const name = s2b(file.name);
        const body = new Uint8Array(await file.arrayBuffer());

        archive.set(await sha2(body), offset);
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
* Converts binary in "minipack" archive format to file object array.
*
* The structure of "minipack" is very simple, and it was inspired by "tar".
*
* The header consists of "4-byte size definition", "32-byte SHA256 hash" and "256-byte file name",
* and the data body is embedded immediately after the header.
*
* This combination of header + body is repeated for the number of files.
*
* In favor of simplicity, advanced features such as directories and permissions are not supported.
* @param archive The byte buffer.
**/
export async function minipackDecode(archive:Uint8Array){
    const files:File[] = [];

    let offset = 0;

    while(offset < archive.byteLength){
        const hash = archive.subarray(offset, offset += size.hash);

        const ns = new DataView(archive.buffer, offset).getUint8(0);
        offset += size.name;

        const bs = new DataView(archive.buffer, offset).getUint32(0);
        offset += size.body;

        const name = b2s(archive.subarray(offset, offset += ns));

        const body = archive.subarray(offset, offset += bs);

        if(hash.toString() !== (await sha2(body)).toString()){
            throw new Error();
        }

        files.push(new File([body], name));
    }

    return files;
}