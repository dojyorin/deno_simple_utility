async function streamConvert(data:Uint8Array, ts:TransformStream<Uint8Array, Uint8Array>){
    return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ts)).arrayBuffer());
}

/**
* Compress binary with "deflate" format.
* Does not contain header such as "gzip" (RFC1952) or "zlib" (RFC1950).
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = await deflateEncode(bin);
* const restored = await deflateDecode(converted);
* ```
*/
export async function deflateEncode(data:Uint8Array):Promise<Uint8Array>{
    return await streamConvert(data, new CompressionStream("deflate-raw"));
}

/**
* Decompress "deflate" format binary.
* Cannot decompress such as "gzip" (RFC1952) or "zlib" (RFC1950) that contain header.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = await deflateEncode(bin);
* const restored = await deflateDecode(converted);
* ```
*/
export async function deflateDecode(data:Uint8Array):Promise<Uint8Array>{
    return await streamConvert(data, new DecompressionStream("deflate-raw"));
}