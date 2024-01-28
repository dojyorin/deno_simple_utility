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
* const random = generateRandom(16);
* ```
*/
export function generateRandom(n:number):Uint8Array{
    return crypto.getRandomValues(new Uint8Array(n));
}

/**
* Derive SHA2 hash value from binary.
* Default is SHA-256.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const hash = await deriveHash(bin);
* ```
*/
export async function deriveHash(data:Uint8Array, sha?:`SHA-${256 | 384 | 512}`):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.digest(sha ?? "SHA-256", data));
}

/**
* Generate exportable public-key pair for ECDH.
* Curve algorithm is "NIST P-256".
* @example
* ```ts
* const k1 = await pkGenerateECDH();
* const k2 = await pkGenerateECDH();
* ```
*/
export async function pkGenerateECDH():Promise<PortableCryptoKeyPair>{
    return await generateKey(CURVE_ECDH, ["deriveKey"]);
}

/**
* Generate exportable public-key pair for ECDSA.
* Curve algorithm is "NIST P-256".
* @example
* ```ts
* const {publicKey, privateKey} = await pkGenerateECDSA();
* ```
*/
export async function pkGenerateECDSA():Promise<PortableCryptoKeyPair>{
    return await generateKey(CURVE_ECDSA, ["sign", "verify"]);
}

/**
* Encrypt binary.
* Algorithm is AES-GCM with 128 bits key, 128 bits tag and 96 bits IV.
* IV is prepended to cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const k1 = await pkGenerateECDH();
* const k2 = await pkGenerateECDH();
* const cipher = await pkEncrypt(bin, {
*     publicKey: k1.publicKey,
*     privateKey: k2.privateKey
* });
* const decrypt = await pkDecrypt(cipher, {
*     publicKey: k2.publicKey,
*     privateKey: k1.privateKey
* });
* ```
*/
export async function pkEncrypt(data:Uint8Array, {publicKey, privateKey}:PortableCryptoKeyPair):Promise<Uint8Array>{
    const aes = {
        name: AES_MODE,
        iv: generateRandom(12)
    };

    const output = new Uint8Array(aes.iv.byteLength + data.byteLength + 16);
    output.set(aes.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(aes, await deriveKey({publicKey, privateKey}), data)), aes.iv.byteLength);

    return output;
}

/**
* Decrypt binary.
* Algorithm is AES-GCM with 128 bits key, 128 bits tag and 96 bits IV.
* IV is read from head of cipher.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const k1 = await pkGenerateECDH();
* const k2 = await pkGenerateECDH();
* const cipher = await pkEncrypt(bin, {
*     publicKey: k1.publicKey,
*     privateKey: k2.privateKey
* });
* const decrypt = await pkDecrypt(cipher, {
*     publicKey: k2.publicKey,
*     privateKey: k1.privateKey
* });
* ```
*/
export async function pkDecrypt(data:Uint8Array, {publicKey, privateKey}:PortableCryptoKeyPair):Promise<Uint8Array>{
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
* const {publicKey, privateKey} = await pkGenerateECDSA();
* const sign = await pkSign(bin, privateKey);
* const verify = await pkVerify(bin, publicKey, sign);
* ```
*/
export async function pkSign(data:Uint8Array, key:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.sign(MAC_ECDSA, await crypto.subtle.importKey(FORMAT_PRI, key, CURVE_ECDSA, false, ["sign"]), data));
}

/**
* Verify signature using public-key.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const {publicKey, privateKey} = await pkGenerateECDSA();
* const sign = await pkSign(bin, privateKey);
* const verify = await pkVerify(bin, publicKey, sign);
* ```
*/
export async function pkVerify(data:Uint8Array, key:Uint8Array, sign:Uint8Array):Promise<boolean>{
    return await crypto.subtle.verify(MAC_ECDSA, await crypto.subtle.importKey(FORMAT_PUB, key, CURVE_ECDSA, false, ["verify"]), sign, data);
}