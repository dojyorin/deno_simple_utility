/**
* After exporting `CryptoKey`.
*/
export type PortableCryptoKey = Uint8Array;

/**
* `PortableCryptoKey` pair.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, PortableCryptoKey>;

/**
* Hash length of SHA2 algorithm.
*/
export type HashMethod = "SHA-256" | "SHA-384" | "SHA-512";

/**
* Curve usage, key derivation or signature verification.
*/
export type CurveMethod = "ECDH" | "ECDSA";

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
* const uuid = cryptoUuid(); // "xxxxxxxx-xxxx-4xxx-(89AB)xxx-xxxxxxxxxxxx"
*/
export function cryptoUuid(){
    return crypto.randomUUID();
}

/**
* Generate random number byte array with the specified number of bytes.
* @example
* const random = cryptoRandom(16); // Output 16 bytes.
*/
export function cryptoRandom(n:number){
    return crypto.getRandomValues(new Uint8Array(n));
}

/**
* Derive SHA2 hash value from byte array.
* @example
* const hash = await cryptoHash("SHA-256", await Deno.readFile("/path/to/file"));
*/
export async function cryptoHash(type:HashMethod, data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest(type, data));
}

/**
* Generate and export public/private key pair as a portable byte array.
* @example
* const keyForECDH = await cryptoGenerateKey(true); // Key for ECDH.
* const keyForECDSA = await cryptoGenerateKey(false); // Key for ECDSA.
*/
export async function cryptoGenerateKey(isECDH:boolean):Promise<PortableCryptoKeyPair>{
    const {publicKey, privateKey} = await crypto.subtle.generateKey(isECDH ? dhKey : dsaKey, true, isECDH ? ["deriveKey", "deriveBits"] : ["sign", "verify"]);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey("spki", publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey("pkcs8", privateKey))
    };
}

/**
* Encrypt byte array using AES, the IV is prepended to the byte array.
* @example
* const key1 = await cryptoGenerateKey(true);
* const key2 = await cryptoGenerateKey(true);
* const encrypt = await cryptoEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, await Deno.readFile("/path/to/file"));
* const decrypt = await cryptoDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, encrypt);
*/
export async function cryptoEncrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array){
    const gcm = aesGcmConfig(cryptoRandom(sizeIv));
    const output = new Uint8Array((gcm.tagLength ?? 0 / 8) + gcm.iv.byteLength + data.byteLength);
    output.set(<Uint8Array>gcm.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(gcm, await deriveSecretKey({publicKey, privateKey}), data)), gcm.iv.byteLength);

    return output;
}

/**
* Decrypt encrypted byte array using AES, read the IV prepended to the byte array.
* @example
* const key1 = await cryptoGenerateKey(true);
* const key2 = await cryptoGenerateKey(true);
* const encrypt = await cryptoEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, await Deno.readFile("/path/to/file"));
* const decrypt = await cryptoDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, encrypt);
*/
export async function cryptoDecrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array){
    const gcm = aesGcmConfig(data.subarray(0, sizeIv));

    return new Uint8Array(await crypto.subtle.decrypt(gcm, await deriveSecretKey({publicKey, privateKey}), data.subarray(gcm.iv.byteLength)));
}

/**
* Create byte array signature using the private key and SHA2 hash algorithm.
* @example
* const file = await Deno.readFile("/path/to/file");
* const key = await cryptoGenerateKey(false);
* const signature = await cryptoSign(key.privateKey, file);
* const result = await cryptoVerify(key.publicKey, signature, file);
*/
export async function cryptoSign(privateKey:PortableCryptoKey, data:Uint8Array){
    return new Uint8Array(await crypto.subtle.sign(dsaHash, await crypto.subtle.importKey("pkcs8", privateKey, dsaKey, false, ["sign"]), data));
}

/**
* Verifies the correct signature of a byte array using the public key and SHA2 hash algorithm.
* @example
* const file = await Deno.readFile("/path/to/file");
* const key = await cryptoGenerateKey(false);
* const signature = await cryptoSign(key.privateKey, file);
* const result = await cryptoVerify(key.publicKey, signature, file);
*/
export async function cryptoVerify(publicKey:PortableCryptoKey, signature:Uint8Array, data:Uint8Array){
    return await crypto.subtle.verify(dsaHash, await crypto.subtle.importKey("spki", publicKey, dsaKey, false, ["verify"]), signature, data);
}