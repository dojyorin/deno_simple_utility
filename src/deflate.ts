async function streamConvert(data:Uint8Array, ts:TransformStream<Uint8Array, Uint8Array>){
    return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ts)).arrayBuffer());
}

/**
* Compress binary in "deflate" format (RFC1951).
* It does not include header information like "gzip" (RFC1952) or "zlib" (RFC1950) as it does purely "compression only".
* @param data byte array.
* @return "deflate" compressed byte array.
*/
export async function deflateEncode(data:Uint8Array){
    return await streamConvert(data, new CompressionStream("deflate-raw"));
}

/**
* Decompress "deflate" format (RFC1951) binary.
* Binaries containing header information like "gzip" (RFC1952) or "zlib" (RFC1950) cannot be decompressed.
* @param data "deflate" compressed byte array.
* @return decompressed byte array.
*/
export async function deflateDecode(data:Uint8Array){
    return await streamConvert(data, new DecompressionStream("deflate-raw"));
}