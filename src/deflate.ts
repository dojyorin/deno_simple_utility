async function deflate(data:Uint8Array, ctx:CompressionStream|DecompressionStream){
    return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ctx)).arrayBuffer());
}

/**
* Compresses raw binary in "deflate" format (RFC1951 compliant).
* It does not include header information like "gzip" (RFC1952) or "zlib" (RFC1950) as it does purely "compression only".
* @param data The byte buffer.
**/
export async function deflateEncode(data:Uint8Array){
    return await deflate(data, new CompressionStream("deflate-raw"));
}

/**
* Decompress "deflate" format (RFC1951 compliant) binary.
* Binaries containing header information like "gzip" (RFC1952) or "zlib" (RFC1950) cannot be decompressed.
* @param data The byte buffer.
**/
export async function deflateDecode(data:Uint8Array){
    return await deflate(data, new DecompressionStream("deflate-raw"));
}