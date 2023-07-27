import {base64Encode} from "./base64.ts";

/**
* Assignment of types convertible from blob.
*/
export interface DataType{
    "text": string;
    "base64": string;
    "byte": Uint8Array;
    "buffer": ArrayBuffer;
}

/**
* Convert from blob to specified data type.
* @example
* ```ts
* const file = new File(["my-text"], "example.txt");
* const data = await blobConvert(file, "text");
* ```
*/
export async function blobConvert<T extends keyof DataType>(blob:Blob, type:T):Promise<DataType[T]>{
    switch(type){
        case "text": return <DataType[T]>await blob.text();
        case "base64": return <DataType[T]>base64Encode(new Uint8Array(await blob.arrayBuffer()));
        case "byte": return <DataType[T]>new Uint8Array(await blob.arrayBuffer());
        case "buffer": return <DataType[T]>await blob.arrayBuffer();
        default: throw new Error();
    }
}