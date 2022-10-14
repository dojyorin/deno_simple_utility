// Header struct.
//   [BodySize:   4-byte]
//   [BodyHash:  32-byte]
//   [FileName: 256-byte]
// Total: 292-byte
const HEADER_SIZE = 4;
const HEADER_HASH = 32;
const HEADER_NAME = 256;
const HEADERS = HEADER_SIZE + HEADER_HASH + HEADER_NAME;

async function deriveHash(data:ArrayBuffer){
    return await crypto.subtle.digest("SHA-256", data);
}

function byteString(data:ArrayBuffer){
    return new Uint8Array(data).toString();
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
    if(files.some(({size, name}) => size > (0x100 ** HEADER_SIZE) || new TextEncoder().encode(name).byteLength > HEADER_NAME)){
        throw new Error();
    }

    const archive = new Uint8Array(HEADERS * files.length + files.reduce((a, {size}) => a + size, 0));

    let offset = 0;

    for(const file of files){
        const data = await file.arrayBuffer();

        const dv = new DataView(new ArrayBuffer(4));
        dv.setUint32(0, file.size);

        archive.set(new Uint8Array(dv.buffer), offset);
        offset += HEADER_SIZE;
        archive.set(new Uint8Array(await deriveHash(data)), offset);
        offset += HEADER_HASH;
        archive.set(new TextEncoder().encode(file.name), offset);
        offset += HEADER_NAME;
        archive.set(new Uint8Array(data), offset);
        offset += file.size;
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
        const size = new DataView(archive.slice(offset, offset += HEADER_SIZE).buffer).getUint32(0);
        const hash = archive.slice(offset, offset += HEADER_HASH);
        const name = new TextDecoder().decode(archive.slice(offset, offset += HEADER_NAME)).replace(/\0+$/, "");
        const data = archive.slice(offset, offset += size);

        if(byteString(hash) !== byteString(await deriveHash(data))){
            throw new Error();
        }

        files.push(new File([data], name));
    }

    return files;
}