import {assertEquals} from "../deps.test.ts";
import {generateKeyPair, cryptoEncrypt, cryptoDecrypt, cryptoSign, cryptoVerify} from "../src/crypto.ts";

const sample = new Uint8Array([0x02, 0xF2, 0x5D, 0x1F, 0x1C, 0x34, 0xB9, 0x2F]);

Deno.test({
    name: "Crypto: Encrypt and Decrypt",
    async fn(){
        const key1 = await generateKeyPair(false);
        const key2 = await generateKeyPair(false);

        const encrypt = await cryptoEncrypt({
            publicKey: key1.publicKey,
            privateKey: key2.privateKey
        }, sample);

        const decrypt = await cryptoDecrypt({
            publicKey: key2.publicKey,
            privateKey: key1.privateKey
        }, encrypt);

        assertEquals(decrypt, sample);
    }
});

Deno.test({
    name: "Crypto: Sign and Verify",
    async fn(){
        const key = await generateKeyPair(true);

        const signature = await cryptoSign(key.privateKey, sample);
        const verify = await cryptoVerify(signature, key.publicKey, sample);

        assertEquals(verify, true);
    }
});