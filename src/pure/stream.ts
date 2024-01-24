/**
* Convert from binary to stream.
* @example
* ```ts
* const rs = streamEncode(new Uint8Array([0x00, 0x01, 0x02]));
* ```
*/
export function streamEncode(data:Uint8Array):ReadableStream<Uint8Array>{
    const {body} = new Response(data);

    if(!body){
        throw new Error();
    }

    return body;
}

/**
* Convert from stream to binary.
* @example
* ```ts
* const rs = streamEncode(new Uint8Array([0x00, 0x01, 0x02]));
* const data = await streamDecode(rs);
* ```
*/
export async function streamDecode(rs:ReadableStream<Uint8Array>):Promise<Uint8Array>{
    return new Uint8Array(await new Response(rs).arrayBuffer());
}