const HEADER_SIZE = 4;
const HEADER_HASH = 32;
const HEADER_NAME = 256;
const HEADERS = HEADER_SIZE + HEADER_HASH + HEADER_NAME;

async function sha256(data:ArrayBuffer){
    return await crypto.subtle.digest("SHA-256", data);
}

function bString(data:ArrayBuffer){
    return new Uint8Array(data).toString();
}

async function minipackEncode(files:File[]){
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
        archive.set(new Uint8Array(await sha256(data)), offset);
        offset += HEADER_HASH;
        archive.set(new TextEncoder().encode(file.name), offset);
        offset += HEADER_NAME;
        archive.set(new Uint8Array(data), offset);
        offset += file.size;
    }

    return archive.buffer;
}

async function minipackDecode(archive:ArrayBuffer){
    const files:File[] = [];

    let offset = 0;

    while(offset < archive.byteLength){
        const size = new DataView(archive.slice(offset, offset += HEADER_SIZE)).getUint32(0);
        const hash = archive.slice(offset, offset += HEADER_HASH);
        const name = new TextDecoder().decode(archive.slice(offset, offset += HEADER_NAME)).replace(/\0+$/, "");
        const data = archive.slice(offset, offset += size);

        if(bString(hash) !== bString(await sha256(data))){
            throw new Error();
        }

        files.push(new File([data], name));
    }

    return files;
}