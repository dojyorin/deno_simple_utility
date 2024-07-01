/**
* Convert from binary to stream.
* @example
* ```ts
* const stream = streamEncode(new Uint8Array([0x00, 0x01, 0x02]));
* const data = await streamDecode(stream);
* ```
*/
export function streamEncode(...data:Uint8Array[]):ReadableStream<Uint8Array> {
    return new Blob(data).stream();
}

/**
* Convert from stream to binary.
* @example
* ```ts
* const stream = streamEncode(new Uint8Array([0x00, 0x01, 0x02]));
* const data = await streamDecode(stream);
* ```
*/
export async function streamDecode(rs:ReadableStream<Uint8Array>):Promise<Uint8Array> {
    return new Uint8Array(await new Blob(await Array.fromAsync(rs)).arrayBuffer());
}