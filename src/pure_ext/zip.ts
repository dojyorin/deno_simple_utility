import {ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter} from "../../deps.pure_ext.ts";
import {type DataMap} from "../pure/minipack.ts";

export async function zipEncode(files:DataMap[], pw?:string, weak?:boolean):Promise<Uint8Array>{
    const zip = new ZipWriter(new Uint8ArrayWriter(), {
        password: pw,
        zipCrypto: weak
    });

    for(const {name, body} of files){
        await zip.add(name, new Uint8ArrayReader(body), {
            useWebWorkers: false
        });
    }

    return await zip.close();
}

export async function zipDecode(archive:Uint8Array, pw?:string, encode?:string):Promise<DataMap[]>{
    const files:DataMap[] = [];
    const zip = new ZipReader(new Uint8ArrayReader(archive), {
        useWebWorkers: false,
        filenameEncoding: encode,
        password: pw
    });

    for await(const entry of zip.getEntriesGenerator()){
        if(entry.directory){
            continue;
        }

        files.push({
            name: entry.filename,
            body: await entry.getData?.(new Uint8ArrayWriter()) ?? new Uint8Array(0)
        });
    }

    await zip.close();

    return files;
}