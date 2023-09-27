/**
* Serialized `CryptoKeyPair`.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, Uint8Array>;

const ecdsa2 = {
    name: "ECDSA",
    hash: "SHA-384"
};

const pubkeytype = "spki";
const privatekeytype = "pkcs8";

async function generateKey(exc:boolean){
    const {publicKey, privateKey} = await crypto.subtle.generateKey({
        name: exc ? "ECDH" : "ECDSA",
        namedCurve: "P-256"
    }, true, exc ? ["deriveKey", "deriveBits"] : ["sign", "verify"]);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey(pubkeytype, publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey(privatekeytype, privateKey))
    };
}

async function importKey(key:Uint8Array, exc:boolean, pub:boolean){
    return await crypto.subtle.importKey(pub ? pubkeytype : privatekeytype, key, {
        name: exc ? "ECDH" : "ECDSA",
        namedCurve: "P-256"
    }, false, exc ? pub ? [] : ["encrypt", "decrypt"] : pub ? ["verify"] : ["sign"])
}

async function deriveKey({publicKey, privateKey}:PortableCryptoKeyPair){
    return await crypto.subtle.deriveKey({
        name: "ECDH",
        public: await importKey(publicKey, true, true)
    }, await importKey(privateKey, true, false), {
        name: "AES-GCM",
        length: 128
    }, false, ["encrypt", "decrypt"]);
}

async function encrypt(key:CryptoKey, data:Uint8Array){
    const aes = {
        name: "AES-GCM",
        iv: randomBin(12)
    };

    const output = new Uint8Array(aes.iv.byteLength + data.byteLength);
    output.set(aes.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(aes, key, data)), aes.iv.byteLength);

    return output;
}

async function decrypt(key:CryptoKey, data:Uint8Array):Promise<Uint8Array>{
    const aes = {
        name: "AES-GCM",
        iv: data.subarray(0, 12)
    };

    return new Uint8Array(await crypto.subtle.decrypt(aes, key, data.subarray(aes.iv.byteLength)));
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
* Algorithm use is "NIST P-384".
* @example
* ```ts
* const key1 = await pubkeyGenECDH();
* const key2 = await pubkeyGenECDH();
* ```
*/
export async function pubkeyGenECDH():Promise<PortableCryptoKeyPair>{
    return await generateKey(true);
}

/**
* Generate exportable public-key pair.
* You can generate keys for ECDSA.
* Algorithm use is "NIST P-384".
* @example
* ```ts
* const key = await pubkeyGenECDSA();
* ```
*/
export async function pubkeyGenECDSA():Promise<PortableCryptoKeyPair>{
    return await generateKey(false);
}

/**
* Encrypt binary.
* Algorithm use is "AES-GCM" with 256 bits key, 128 bits tag and 96 bits IV.
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
export async function pubkeyEncrypt(key:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    return await encrypt(await deriveKey(key), data);
}

/**
* Decrypt binary.
* Algorithm use is "AES-GCM" with 256 bits key, 128 bits tag and 96 bits IV.
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
export async function pubkeyDecrypt(key:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    return await decrypt(await deriveKey(key), data);
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
export async function pubkeySign(privateKey:Uint8Array, data:Uint8Array):Promise<Uint8Array>{
    return new Uint8Array(await crypto.subtle.sign(ecdsa2, await importKey(privateKey, false, false), data));
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
export async function pubkeyVerify(publicKey:Uint8Array, signature:Uint8Array, data:Uint8Array):Promise<boolean>{
    return await crypto.subtle.verify(ecdsa2, await importKey(publicKey, false, true), signature, data);
}