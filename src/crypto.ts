/**
* Serialized `CryptoKeyPair`.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, Uint8Array>;

async function importSignKey(key:Uint8Array, pub:boolean){
    return await crypto.subtle.importKey(pub ? "spki" : "pkcs8", key, {
        name: "ECDSA",
        namedCurve: "P-384"
    }, false, [pub ? "verify" : "sign"]);
}

async function importDeriveKey(key:Uint8Array, pub:boolean){
    return await crypto.subtle.importKey(pub ? "spki" : "pkcs8", key, {
        name: "ECDH",
        namedCurve: "P-384"
    }, false, pub ? [] : ["deriveKey", "deriveBits"]);
}

async function deriveSecretKey({publicKey, privateKey}:PortableCryptoKeyPair){
    return await crypto.subtle.deriveKey({
        name: "ECDH",
        public: await importDeriveKey(publicKey, true)
    }, await importDeriveKey(privateKey, false), {
        name: "AES-GCM",
        length: 192
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
* You can generate keys for ECDH or ECDSA.
* Algorithm use is "NIST P-384".
* @example
* ```ts
* const key1 = await pubkeyGen("ECDH");
* const key2 = await pubkeyGen("ECDSA");
* ```
*/
export async function pubkeyGen(usage:"ECDH" | "ECDSA"):Promise<PortableCryptoKeyPair>{
    const {publicKey, privateKey} = await crypto.subtle.generateKey({
        name: usage,
        namedCurve: "P-384"
    }, true, usage === "ECDH" ? ["deriveKey", "deriveBits"] : ["sign", "verify"]);

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
    const enc = await crypto.subtle.encrypt({
        name: "AES-GCM",
        tagLength: 128,
        iv: iv
    }, await deriveSecretKey({publicKey, privateKey}), data);

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
    const dec = await crypto.subtle.decrypt({
        name: "AES-GCM",
        tagLength: 128,
        iv: iv
    }, await deriveSecretKey({publicKey, privateKey}), data.subarray(iv.byteLength));

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
    const sign = await crypto.subtle.sign({
        name: "ECDSA",
        hash: "SHA-384"
    }, await importSignKey(privateKey, false), data);

    return new Uint8Array(sign);
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
    return await crypto.subtle.verify({
        name: "ECDSA",
        hash: "SHA-384"
    }, await importSignKey(publicKey, true), signature, data);
}