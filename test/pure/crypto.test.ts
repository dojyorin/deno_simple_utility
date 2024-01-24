import {assertEquals} from "../../deps.test.ts";
import {generateRandom, deriveHash, pkGenerateECDH, pkGenerateECDSA, pkEncrypt, pkDecrypt, pkSign, pkVerify} from "../../src/pure/crypto.ts";

const sample = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);

const hashResult = new Uint8Array([
    0x85, 0x00, 0x70, 0xAF, 0xED, 0xB1, 0x69, 0xC9,
    0x57, 0x23, 0x6F, 0x3B, 0x06, 0xB7, 0xA4, 0x4B,
    0x06, 0x71, 0x1F, 0x39, 0x80, 0x42, 0x9B, 0xDA,
    0xD5, 0x07, 0x91, 0x49, 0x8D, 0xE9, 0xB9, 0xFA,
    0x82, 0xA6, 0x37, 0xAD, 0xF2, 0xB5, 0x42, 0xD0,
    0x20, 0x3B, 0x72, 0xCB, 0x0D, 0xA6, 0x96, 0x60,
    0x02, 0xFD, 0xB1, 0xC0, 0x9C, 0xCA, 0x1D, 0xD2,
    0x0D, 0xE6, 0x31, 0xDA, 0x4B, 0xBD, 0xD4, 0x58
]);

Deno.test({
    name: "Crypto: Random",
    fn(){
        const {byteLength} = generateRandom(16);

        assertEquals(byteLength, 16);
    }
});

Deno.test({
    name: "Crypto: Hash",
    async fn(){
        const hash = await deriveHash(512, sample);

        assertEquals(hash, hashResult);
    }
});

Deno.test({
    name: "Crypto: Encrypt and Decrypt",
    async fn(){
        const key1 = await pkGenerateECDH();
        const key2 = await pkGenerateECDH();

        const encrypt = await pkEncrypt({
            publicKey: key1.publicKey,
            privateKey: key2.privateKey
        }, sample);

        const decrypt = await pkDecrypt({
            publicKey: key2.publicKey,
            privateKey: key1.privateKey
        }, encrypt);

        assertEquals(decrypt, sample);
    }
});

Deno.test({
    name: "Crypto: Sign and Verify",
    async fn(){
        const key = await pkGenerateECDSA();
        const signature = await pkSign(key.privateKey, sample);
        const verify = await pkVerify(key.publicKey, signature, sample);

        assertEquals(verify, true);
    }
});