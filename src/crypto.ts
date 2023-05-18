/**
* Serialized `CryptoKey`.
*/
export type PortableCryptoKey = Uint8Array;

/**
* Serialized `CryptoKeyPair`.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, PortableCryptoKey>;

const sizeIv = 12;

const dhKey = Object.freeze(<EcKeyAlgorithm>{
    name: "ECDH",
    namedCurve: "P-521"
});

const dsaKey = Object.freeze(<EcKeyAlgorithm>{
    name: "ECDSA",
    namedCurve: "P-521"
});

const dsaHash = Object.freeze(<EcdsaParams>{
    name: "ECDSA",
    hash: "SHA-512"
});

function aesGcmConfig(iv:Uint8Array):AesGcmParams{
    return {
        name: "AES-GCM",
        tagLength: 128,
        iv
    };
}

async function deriveSecretKey({publicKey, privateKey}:PortableCryptoKeyPair){
    return await crypto.subtle.deriveKey({
        name: "ECDH",
        public: await crypto.subtle.importKey("spki", publicKey, dhKey, false, [])
    }, await crypto.subtle.importKey("pkcs8", privateKey, dhKey, false, ["deriveKey", "deriveBits"]), {
        name: "AES-GCM",
        length: 256
    }, false, ["encrypt", "decrypt"]);
}

/**
* Generate UUIDv4 string.
* @example
* ```ts
* const uuid = cryptoUuid();
* ```
*/
export function cryptoUuid():string{
    return crypto.randomUUID();
}

/**
* Generate random binary with any number of bytes.
* @example
* ```ts
* const random = cryptoRandom(16);
* ```
*/
export function cryptoRandom(n:number):Uint8Array{
    return crypto.getRandomValues(new Uint8Array(n));
}

/**
* Derive SHA2 hash value from binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const hash = await cryptoHash(256, bin);
* ```
*/
export async function cryptoHash(bit:256|384|512, data:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.digest(`SHA-${bit}`, data));
}

/**
* Generate exportable public-key pair.
* You can generate keys for ECDH or ECDSA.
* Algorithm use is "NIST P-512".
* @example
* ```ts
* const keyForECDH = await cryptoGenerateKey(true);
* const keyForECDSA = await cryptoGenerateKey(false);
* ```
*/
export async function cryptoGenerateKey(isECDH:boolean):Promise<PortableCryptoKeyPair>{
    const {publicKey, privateKey} = await crypto.subtle.generateKey(isECDH ? dhKey : dsaKey, true, isECDH ? ["deriveKey", "deriveBits"] : ["sign", "verify"]);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey("spki", publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey("pkcs8", privateKey))
    };
}

/**
* Encrypt binary.
* Algorithm use is "AES-GCM" with 256 bits key, 128 bits tag and 96 bits IV.
* IV is prepended to cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await cryptoGenerateKey(true);
* const key2 = await cryptoGenerateKey(true);
* const converted = await cryptoEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, bin);
* const restored = await cryptoDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, converted);
* ```
*/
export async function cryptoEncrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const gcm = aesGcmConfig(cryptoRandom(sizeIv));
    const output = new Uint8Array((gcm.tagLength ?? 0 / 8) + gcm.iv.byteLength + data.byteLength);
    output.set(<Uint8Array>gcm.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(gcm, await deriveSecretKey({publicKey, privateKey}), data)), gcm.iv.byteLength);

    return output;
}

/**
* Decrypt binary.
* Algorithm use is "AES-GCM" with 256 bits key, 128 bits tag and 96 bits IV.
* IV is read from head of cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await cryptoGenerateKey(true);
* const key2 = await cryptoGenerateKey(true);
* const converted = await cryptoEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, bin);
* const restored = await cryptoDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, converted);
* ```
*/
export async function cryptoDecrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const gcm = aesGcmConfig(data.subarray(0, sizeIv));

    return new Uint8Array(await crypto.subtle.decrypt(gcm, await deriveSecretKey({publicKey, privateKey}), data.subarray(gcm.iv.byteLength)));
}

/**
* Create signature using private-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key = await cryptoGenerateKey(false);
* const signature = await cryptoSign(key.privateKey, bin);
* const verified = await cryptoVerify(key.publicKey, signature, bin);
* ```
*/
export async function cryptoSign(privateKey:PortableCryptoKey, data:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.sign(dsaHash, await crypto.subtle.importKey("pkcs8", privateKey, dsaKey, false, ["sign"]), data));
}

/**
* Verify signature using public-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key = await cryptoGenerateKey(false);
* const signature = await cryptoSign(key.privateKey, bin);
* const verified = await cryptoVerify(key.publicKey, signature, bin);
* ```
*/
export async function cryptoVerify(publicKey:PortableCryptoKey, signature:Uint8Array, data:Uint8Array):Promise<boolean>{
    return await crypto.subtle.verify(dsaHash, await crypto.subtle.importKey("spki", publicKey, dsaKey, false, ["verify"]), signature, data);
}