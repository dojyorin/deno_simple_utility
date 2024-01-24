import {streamEncode, streamDecode} from "./stream.ts";

/**
* Compress binary with "deflate" format.
* Does not contain header such as "gzip" (RFC1952) or "zlib" (RFC1950).
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = await deflateEncode(bin);
* const decode = await deflateDecode(encode);
* ```
*/
export async function deflateEncode(data:Uint8Array):Promise<Uint8Array>{
    return await streamDecode(streamEncode(data).pipeThrough(new CompressionStream("deflate-raw")));
}

/**
* Decompress "deflate" format binary.
* Cannot decompress such as "gzip" (RFC1952) or "zlib" (RFC1950) that contain header.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = await deflateEncode(bin);
* const decode = await deflateDecode(encode);
* ```
*/
export async function deflateDecode(data:Uint8Array):Promise<Uint8Array>{
    return await streamDecode(streamEncode(data).pipeThrough(new DecompressionStream("deflate-raw")));
}