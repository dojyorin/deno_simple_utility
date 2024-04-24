import {assertEquals} from "../../deps.test.ts";
import {base64Encode, base64Decode, base64DataURL} from "../../src/pure/base64.ts";

const sample1 = new Uint8Array([
    0x58, 0x0D, 0xC7, 0x64, 0x21, 0x42, 0x27, 0x76,
    0x2E, 0xA6, 0xFE, 0x9E, 0x58, 0xA3, 0x93, 0x9A,
    0x9A, 0x07, 0x57, 0xAE, 0x4E, 0x5B, 0x2F, 0xC7,
    0x7A, 0xEF, 0xD7, 0xAF, 0xF5, 0x1F, 0x2A, 0x3A
]);

const sample2 = "WA3HZCFCJ3Yupv6eWKOTmpoHV65OWy/Heu/Xr/UfKjo=";

Deno.test({
    name: "Base64: Encode",
    fn(){
        const encode = base64Encode(sample1);

        assertEquals(encode, sample2);
    }
});

Deno.test({
    name: "Base64: Decode",
    fn(){
        const decode = base64Decode(sample2);

        assertEquals(decode, sample1);
    }
});

Deno.test({
    name: "Base64: DataURL",
    fn(){
        const encode = base64DataURL(sample1);

        assertEquals(encode, `data:application/octet-stream;base64,${sample2}`);
    }
});