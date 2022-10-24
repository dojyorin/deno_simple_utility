// Header struct.
//   [BodySize:   4-byte]
//   [BodyHash:  32-byte]
//   [FileName: 256-byte]
// Total: 292-byte
const headerStruct = <const>{
    body: 4,
    hash: 32,
    name: 256
};

const headerTotal = Object.values(headerStruct).reduce((a, c) => a + c, 0);

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
    const archive = new Uint8Array(files.reduce((a, {size}) => a + size + headerTotal, 0));

    let offset = 0;

    for(const file of files){
        const data = new Uint8Array(await file.arrayBuffer());

        new DataView(archive.buffer, offset).setUint32(0, file.size);
        offset += headerStruct.body;
        archive.set(await sha2(data), offset);
        offset += headerStruct.hash;
        archive.set(s2b(file.name).subarray(0, headerStruct.name), offset);
        offset += headerStruct.name;
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
        const hash = archive.subarray(offset += headerStruct.body, offset += headerStruct.hash);
        const name = b2s(archive.subarray(offset, offset += headerStruct.name)).replace(/\0+$/, "");
        const data = archive.subarray(offset, offset += size);

        if(hash.toString() !== (await sha2(data)).toString()){
            throw new Error();
        }

        files.push(new File([data], name));
    }

    return files;
}