/**
* Serialized `CryptoKeyPair`.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, Uint8Array>;

const AES_MODE = "AES-GCM";
const AES_BIT = 128;
const FORMAT_PUB = "spki";
const FORMAT_PRI = "pkcs8";

const CURVE_ECDH = Object.freeze({
    name: "ECDH",
    namedCurve: "P-256"
});

const CURVE_ECDSA = Object.freeze({
    name: "ECDSA",
    namedCurve: "P-256"
});

const MAC_ECDSA = Object.freeze({
    name: "ECDSA",
    hash: "SHA-256"
});

async function generateKey(alg:EcKeyAlgorithm, usage:KeyUsage[]){
    const {publicKey, privateKey} = await crypto.subtle.generateKey(alg, true, usage);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey(FORMAT_PUB, publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey(FORMAT_PRI, privateKey))
    };
}

async function deriveKey({publicKey, privateKey}:PortableCryptoKeyPair){
    return await crypto.subtle.deriveKey({
        name: CURVE_ECDH.name,
        public: await crypto.subtle.importKey(FORMAT_PUB, publicKey, CURVE_ECDH, false, [])
    }, await crypto.subtle.importKey(FORMAT_PRI, privateKey, CURVE_ECDH, false, ["deriveKey"]), {
        name: AES_MODE,
        length: AES_BIT
    }, false, ["encrypt", "decrypt"]);
}

/**
* Generate random binary with any number of bytes.
* @example
* ```ts
* const random = randomBin(16);
* ```
*/
export function randomBin(n:number):Uint8Array{
    return crypto.getRandomValues(new Uint8Array(n));
}

/**
* Derive SHA2 hash value from binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const hash = await hashValue(256, bin);
* ```
*/
export async function hashValue(bit:256 | 384 | 512, data:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.digest(`SHA-${bit}`, data));
}

/**
* Generate exportable public-key pair.
* You can generate keys for ECDH.
* Algorithm use is "NIST P-256".
* @example
* ```ts
* const key1 = await pubkeyGen("ECDH");
* const key2 = await pubkeyGen("ECDSA");
* ```
*/
export async function generateKeyECDH():Promise<PortableCryptoKeyPair>{
    return await generateKey(CURVE_ECDH, ["deriveKey"]);
}

/**
* Generate exportable public-key pair.
* You can generate keys for ECDSA.
* Algorithm use is "NIST P-256".
* @example
* ```ts
* const key1 = await pubkeyGen("ECDH");
* const key2 = await pubkeyGen("ECDSA");
* ```
*/
export async function generateKeyECDSA():Promise<PortableCryptoKeyPair>{
    return await generateKey(CURVE_ECDSA, ["sign", "verify"]);
}

/**
* Encrypt binary.
* Algorithm use is AES_MODE with 256 bits key, 128 bits tag and 96 bits IV.
* IV is prepended to cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await pubkeyGen("ECDH");
* const key2 = await pubkeyGen("ECDH");
* const converted = await pubkeyEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, bin);
* const restored = await pubkeyDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, converted);
* ```
*/
export async function pubkeyEncrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const aes = {
        name: AES_MODE,
        iv: randomBin(12)
    };

    const output = new Uint8Array(aes.iv.byteLength + data.byteLength + 16);
    output.set(aes.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(aes, await deriveKey({publicKey, privateKey}), data)), aes.iv.byteLength);

    return output;
}

/**
* Decrypt binary.
* Algorithm use is AES_MODE with 256 bits key, 128 bits tag and 96 bits IV.
* IV is read from head of cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key1 = await pubkeyGen("ECDH");
* const key2 = await pubkeyGen("ECDH");
* const converted = await pubkeyEncrypt({
*     publicKey: key1.publicKey,
*     privateKey: key2.privateKey
* }, bin);
* const restored = await pubkeyDecrypt({
*     publicKey: key2.publicKey,
*     privateKey: key1.privateKey
* }, converted);
* ```
*/
export async function pubkeyDecrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const aes = {
        name: AES_MODE,
        iv: data.subarray(0, 12)
    };

    return new Uint8Array(await crypto.subtle.decrypt(aes, await deriveKey({publicKey, privateKey}), data.subarray(aes.iv.byteLength)));
}

/**
* Create signature using private-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key = await pubkeyGen("ECDSA");
* const signature = await pubkeySign(key.privateKey, bin);
* const verified = await pubkeyVerify(key.publicKey, signature, bin);
* ```
*/
export async function pubkeySign(key:Uint8Array, data:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.sign(MAC_ECDSA, await crypto.subtle.importKey(FORMAT_PRI, key, CURVE_ECDSA, false, ["sign"]), data));
}

/**
* Verify signature using public-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const key = await pubkeyGen("ECDSA");
* const signature = await pubkeySign(key.privateKey, bin);
* const verified = await pubkeyVerify(key.publicKey, signature, bin);
* ```
*/
export async function pubkeyVerify(key:Uint8Array, sign:Uint8Array, data:Uint8Array):Promise<boolean>{
    return await crypto.subtle.verify(MAC_ECDSA, await crypto.subtle.importKey(FORMAT_PUB, key, CURVE_ECDSA, false, ["verify"]), sign, data);
}