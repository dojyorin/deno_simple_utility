import {ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter} from "../../deps.pure.ts";
import {type DataEntry} from "../pure/minipack.ts";

/**
* Convert from named binary to ZIP archive.
* @see https://deno.land/x/zipjs
* @example
* ```ts
* const files = [{
*     name: "foo.txt",
*     body: await Deno.readFile("./foo.txt")
* }];
* const zip = await zipEncode(files);
* const files = await zipDecode(zip);
* ```
*/
export async function zipEncode(files: DataEntry[], pw?: string, weak?: boolean): Promise<Uint8Array> {
    const zip = new ZipWriter(new Uint8ArrayWriter(), {
        password: pw,
        zipCrypto: weak
    });

    for(const {name, body} of files) {
        await zip.add(name, new Uint8ArrayReader(body), {
            useWebWorkers: false
        });
    }

    return await zip.close();
}

/**
* Convert from ZIP archive to named binary.
* @see https://deno.land/x/zipjs
* @example
* ```ts
* const files = [{
*     name: "foo.txt",
*     body: await Deno.readFile("./foo.txt")
* }];
* const zip = await zipEncode(files);
* const files = await zipDecode(zip);
* ```
*/
export async function zipDecode(archive: Uint8Array, pw?: string, encode?: string): Promise<DataEntry[]> {
    const files: DataEntry[] = [];
    const zip = new ZipReader(new Uint8ArrayReader(archive), {
        checkPasswordOnly: false,
        useWebWorkers: false,
        filenameEncoding: encode,
        password: pw
    });

    for await(const entry of zip.getEntriesGenerator()) {
        if(entry.directory) {
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