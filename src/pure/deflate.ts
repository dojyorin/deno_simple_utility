import {streamEncode, streamDecode} from "./stream.ts";

type CompressCodec = "gzip" | "deflate" | "deflate-raw";

const COMPRESS_CODEC = "deflate-raw";

/**
* Compress binary with DEFLATE format.
* Default codec is DEFLATE with no header (RFC-1951) and name in WebAPI specification is `"deflate-raw"`.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = await deflateEncode(bin);
* const decode = await deflateDecode(encode);
* ```
*/
export async function deflateEncode(data:Uint8Array, codec?:CompressCodec):Promise<Uint8Array>{
    return await streamDecode(streamEncode(data).pipeThrough(new CompressionStream(codec ?? COMPRESS_CODEC)));
}

/**
* Decompress DEFLATE format binary.
* Default codec is DEFLATE with no header (RFC-1951) and name in WebAPI specification is `"deflate-raw"`.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const encode = await deflateEncode(bin);
* const decode = await deflateDecode(encode);
* ```
*/
export async function deflateDecode(data:Uint8Array, codec?:CompressCodec):Promise<Uint8Array>{
    return await streamDecode(streamEncode(data).pipeThrough(new DecompressionStream(codec ?? COMPRESS_CODEC)));
}