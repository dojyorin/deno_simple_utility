interface PubKey {
    pub: Uint8Array;
    key: Uint8Array;
}

const AES_MODE = "AES-GCM";
const AES_SIZE = 128;
const CURVE_KEX = Object.freeze<EcKeyAlgorithm>({
    name: "ECDH",
    namedCurve: "P-256"
});
const CURVE_DSA = Object.freeze<EcKeyAlgorithm & EcdsaParams>({
    name: "ECDSA",
    namedCurve: "P-256",
    hash: "SHA-256"
});

async function generateKey(alg:EcKeyAlgorithm, usage:KeyUsage[]):Promise<PubKey> {
    const {publicKey, privateKey} = await crypto.subtle.generateKey(alg, true, usage);

    return {
        pub: new Uint8Array(await crypto.subtle.exportKey("spki", publicKey)),
        key: new Uint8Array(await crypto.subtle.exportKey("pkcs8", privateKey))
    };
}

async function deriveKey(pub:Uint8Array, key:Uint8Array):Promise<CryptoKey> {
    return await crypto.subtle.deriveKey({
        name: CURVE_KEX.name,
        public: await crypto.subtle.importKey("spki", pub, CURVE_KEX, false, [])
    }, await crypto.subtle.importKey("pkcs8", key, CURVE_KEX, false, ["deriveKey"]), {
        name: AES_MODE,
        length: AES_SIZE
    }, false, ["encrypt", "decrypt"]);
}

/**
* Generate random binary with any number of bytes.
* @example
* ```ts
* const random = cryptoRandom(16);
* ```
*/
export function cryptoRandom(n:number):Uint8Array {
    return crypto.getRandomValues(new Uint8Array(n));
}

/**
* Derive hash value from binary.
* Default is SHA-256.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const hash = await cryptoHash(bin);
* ```
*/
export async function cryptoHash(data:Uint8Array, alg?:string):Promise<Uint8Array> {
    return new Uint8Array(await crypto.subtle.digest(alg ?? "SHA-256", data));
}

/**
* Generate exportable public-key pair for ECDH.
* Curve algorithm is "NIST P-256".
* Key format is SPKI for public-key and PKCS8 for private-key.
* @example
* ```ts
* const key1 = await cryptoGenerateEncryptKey();
* const key2 = await cryptoGenerateEncryptKey();
* ```
*/
export async function cryptoGenerateEncryptKey():Promise<PubKey> {
    return await generateKey(CURVE_KEX, ["deriveKey"]);
}

/**
* Generate exportable public-key pair for ECDSA.
* Curve algorithm is "NIST P-256".
* Key format is SPKI for public-key and PKCS8 for private-key.
* @example
* ```ts
* const {pub, key} = await cryptoGenerateSignKey();
* ```
*/
export async function cryptoGenerateSignKey():Promise<PubKey> {
    return await generateKey(CURVE_DSA, ["sign", "verify"]);
}

/**
* Encrypt binary.
* Algorithm is AES-GCM with 128 bits key, 128 bits tag and 96 bits IV.
* IV is prepended to cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await cryptoGenerateEncryptKey();
* const key2 = await cryptoGenerateEncryptKey();
* const encrypt = await cryptoEncrypt(bin, key1.pub, key2.key);
* const decrypt = await cryptoDecrypt(encrypt, key2.pub, key1.key);
* ```
*/
export async function cryptoEncrypt(data:Uint8Array, pub:Uint8Array, key:Uint8Array):Promise<Uint8Array> {
    const aes:AesGcmParams = {
        name: AES_MODE,
        iv: cryptoRandom(12)
    };

    return new Uint8Array(await new Blob([aes.iv, await crypto.subtle.encrypt(aes, await deriveKey(pub, key), data)]).arrayBuffer());
}

/**
* Decrypt binary.
* Algorithm is AES-GCM with 128 bits key, 128 bits tag and 96 bits IV.
* IV is read from head of cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await cryptoGenerateEncryptKey();
* const key2 = await cryptoGenerateEncryptKey();
* const encrypt = await cryptoEncrypt(bin, key1.pub, key2.key);
* const decrypt = await cryptoDecrypt(encrypt, key2.pub, key1.key);
* ```
*/
export async function cryptoDecrypt(data:Uint8Array, pub:Uint8Array, key:Uint8Array):Promise<Uint8Array> {
    const aes:AesGcmParams = {
        name: AES_MODE,
        iv: data.subarray(0, 12)
    };

    return new Uint8Array(await crypto.subtle.decrypt(aes, await deriveKey(pub, key), data.subarray(aes.iv.byteLength)));
}

/**
* Create signature using private-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const {pub, key} = await cryptoGenerateSignKey();
* const sign = await cryptoSign(bin, key);
* const verify = await cryptoVerify(bin, pub, sign);
* ```
*/
export async function cryptoSign(data:Uint8Array, key:Uint8Array):Promise<Uint8Array> {
    return new Uint8Array(await crypto.subtle.sign(CURVE_DSA, await crypto.subtle.importKey("pkcs8", key, CURVE_DSA, false, ["sign"]), data));
}

/**
* Verify signature using public-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const {pub, key} = await cryptoGenerateSignKey();
* const sign = await cryptoSign(bin, key);
* const verify = await cryptoVerify(bin, pub, sign);
* ```
*/
export async function cryptoVerify(data:Uint8Array, pub:Uint8Array, sign:Uint8Array):Promise<boolean> {
    return await crypto.subtle.verify(CURVE_DSA, await crypto.subtle.importKey("spki", pub, CURVE_DSA, false, ["verify"]), sign, data);
}