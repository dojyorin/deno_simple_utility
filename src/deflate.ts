export async function deflateEncode(data:ArrayBuffer){
    return new Response(new Blob([data]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer();
}

export async function deflateDecode(data:ArrayBuffer){
    return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer();
}