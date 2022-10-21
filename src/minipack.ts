// Header struct.
//   [BodySize:   4-byte]
//   [BodyHash:  32-byte]
//   [FileName: 256-byte]
// Total: 292-byte
const HEADER_SIZE = 4;
const HEADER_HASH = 32;
const HEADER_NAME = 256;
const HEADERS = HEADER_SIZE + HEADER_HASH + HEADER_NAME;

async function sha256(data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}

function text2byte(data:string){
    return new TextEncoder().encode(data);
}

function byte2text(data:Uint8Array){
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
    const archive = new Uint8Array(files.reduce((a, {size}) => a + size + HEADERS, 0));

    let offset = 0;

    for(const file of files){
        const data = new Uint8Array(await file.arrayBuffer());

        new DataView(archive.buffer, offset).setUint32(0, file.size);
        offset += HEADER_SIZE;
        archive.set(await sha256(data), offset);
        offset += HEADER_HASH;
        archive.set(text2byte(file.name).slice(0, 256), offset);
        offset += HEADER_NAME;
        archive.set(data, offset);
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
        const size = new DataView(archive.buffer, offset).getUint32(0);
        const hash = archive.subarray(offset += HEADER_SIZE, offset += HEADER_HASH);
        const name = byte2text(archive.subarray(offset, offset += HEADER_NAME)).replace(/\0+$/, "");
        const data = archive.subarray(offset, offset += size);

        if(hash.toString() !== (await sha256(data)).toString()){
            throw new Error();
        }

        files.push(new File([data], name));
    }

    return files;
}