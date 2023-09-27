/**
* Serialized `CryptoKeyPair`.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, Uint8Array>;

const ecdh = {
    name: "ECDH",
    namedCurve: "P-384"
};

const ecdsa = {
    name: "ECDSA",
    namedCurve: "P-384"
};

const aesenctype = {
    name: "AES-GCM",
    length: 192
};

const ecdsa2 = {
    name: ecdsa.name,
    hash: "SHA-384"
};

const deriveusage:KeyUsage[] = ["deriveKey", "deriveBits"];
const aesusage:KeyUsage[] = ["encrypt", "decrypt"];

const pubkeytype = "spki";
const privatekeytype = "pkcs8";

function deriveinit(key:CryptoKey){
    return {
        name: ecdh.name,
        public: key
    };
}

function aesinit(iv:Uint8Array){
    return {
        name: aesenctype.name,
        iv: iv
    };
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
    const {publicKey, privateKey} = await crypto.subtle.generateKey(ecdh, true, deriveusage);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey(pubkeytype, publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey(privatekeytype, privateKey))
    };
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
    const {publicKey, privateKey} = await crypto.subtle.generateKey(ecdsa, true, ["sign", "verify"]);

    return {
        publicKey: new Uint8Array(await crypto.subtle.exportKey(pubkeytype, publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey(privatekeytype, privateKey))
    };
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
export async function pubkeyEncrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const iv = randomBin(12);
    const key = await crypto.subtle.deriveKey(deriveinit(await crypto.subtle.importKey(pubkeytype, publicKey, ecdh, false, [])), await crypto.subtle.importKey(privatekeytype, privateKey, ecdh, false, deriveusage), aesenctype, false, aesusage);
    const enc = await crypto.subtle.encrypt(aesinit(iv), key, data);

    const output = new Uint8Array(iv.byteLength + enc.byteLength);
    output.set(iv, 0);
    output.set(new Uint8Array(enc), iv.byteLength);

    return output;
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
export async function pubkeyDecrypt({publicKey, privateKey}:PortableCryptoKeyPair, data:Uint8Array):Promise<Uint8Array>{
    const iv = data.subarray(0, 12);
    const key = await crypto.subtle.deriveKey(deriveinit(await crypto.subtle.importKey(pubkeytype, publicKey, ecdh, false, [])), await crypto.subtle.importKey(privatekeytype, privateKey, ecdh, false, deriveusage), aesenctype, false, aesusage);
    const dec = await crypto.subtle.decrypt(aesinit(iv), key, data.subarray(iv.byteLength));

    return new Uint8Array(dec);
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
    return new Uint8Array(await crypto.subtle.sign(ecdsa2, await crypto.subtle.importKey(privatekeytype, privateKey, ecdsa, false, ["sign"]), data));
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
    return await crypto.subtle.verify(ecdsa2, await crypto.subtle.importKey(pubkeytype, publicKey, ecdsa, false, ["verify"]), signature, data);
}