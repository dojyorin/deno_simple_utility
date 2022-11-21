export async function streamConvert(data:Uint8Array, ts:TransformStream<Uint8Array, Uint8Array>){
    return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ts)).arrayBuffer());
}

export async function deriveHash(data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
}