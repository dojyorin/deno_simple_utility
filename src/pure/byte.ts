/**
* Concat multiple sources into single binary.
* @example
* ```ts
* const byte = byteConcat(new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]));
* ```
*/
export function byteConcat(...sources: BufferSource[]): Uint8Array {
    const output = new Uint8Array(sources.reduce((v, {byteLength}) => v + byteLength , 0));

    let i = 0;
    for(const source of sources) {
        output.set(new Uint8Array("buffer" in source ? source.buffer : source), i);
        i += source.byteLength;
    }

    return output;
}