/**
* Means the byte array after exporting `CryptoKey`.
*/
export type PortableCryptoKey = Uint8Array;

/**
* Each is `PortableCryptoKey` public/private key pair.
*/
export interface PortableCryptoKeyPair{
    privateKey: PortableCryptoKey;
    publicKey: PortableCryptoKey;
}

async function parseCommonKey(kp:PortableCryptoKeyPair){
    const ec:EcKeyAlgorithm = {
        namedCurve: "P-384",
        name: "ECDH"
    };

    const publicKey = await crypto.subtle.importKey("spki", kp.publicKey, ec, false, []);
    const privateKey = await crypto.subtle.importKey("pkcs8", kp.privateKey, ec, false, ["deriveKey", "deriveBits"]);

    const dh:EcdhKeyDeriveParams = {
        name: "ECDH",
        public: publicKey
    };

    const aes:AesDerivedKeyParams = {
        name: "AES-GCM",
        length: 256
    };

    return await crypto.subtle.deriveKey(dh, privateKey, aes, false, ["encrypt", "decrypt"]);
}

async function parseSignKey(k:PortableCryptoKey, isPrivate:boolean){
    const format:KeyFormat = isPrivate ? "pkcs8" : "spki";
    const usage:KeyUsage[] = isPrivate ? ["sign"] : ["verify"];

    const ec:EcKeyAlgorithm = {
        namedCurve: "P-384",
        name: "ECDSA"
    };

    return await crypto.subtle.importKey(format, k, ec, false, usage);
}

/**
* Derive SHA2 hash value from byte array.
* @param isHalf Use the hash length 256 bits if `true`, 512 bits if `false`.
* @param data byte array.
* @return byte array of hash value.
*/
export async function deriveHash(isHalf:boolean, data:Uint8Array){
    const sha = isHalf ? "SHA-256" : "SHA-512";

    return new Uint8Array(await crypto.subtle.digest(sha, data));
}

/**
* Generate and export public/private key pair as a portable byte array.
* @param isDsa Outputs the key for ECDSA if `true`, for ECDH if `false`.
* @return public/private key pair, each in byte array.
*/
export async function generateKeyPair(isDsa:boolean){
    const usage:KeyUsage[] = isDsa ? ["sign", "verify"] : ["deriveKey", "deriveBits"];

    const ec:EcKeyAlgorithm = {
        namedCurve: "P-384",
        name: isDsa ? "ECDSA" : "ECDH"
    };

    const {publicKey, privateKey} = await crypto.subtle.generateKey(ec, true, usage);

    return <PortableCryptoKeyPair>{
        publicKey: new Uint8Array(await crypto.subtle.exportKey("spki", publicKey)),
        privateKey: new Uint8Array(await crypto.subtle.exportKey("pkcs8", privateKey))
    };
}

/**
* Encrypt byte array using AES-GCM with 256 bits key, 128 bits tag and 96 bits IV.
* The IV is prepended to the byte array.
* @param kp public/private key pair, each in byte array.
* @param data byte array.
* @return encrypted byte array.
*/
export async function cryptoEncrypt(kp:PortableCryptoKeyPair, data:Uint8Array){
    const sizeTag = 16;
    const sizeIv = 12;

    const gcm:AesGcmParams = {
        name: "AES-GCM",
        tagLength: sizeTag * 8,
        iv: crypto.getRandomValues(new Uint8Array(sizeIv))
    };

    const commonKey = await parseCommonKey(kp);

    const output = new Uint8Array(sizeTag + sizeIv + data.byteLength);
    output.set(<Uint8Array>gcm.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(gcm, commonKey, data)), gcm.iv.byteLength);

    return output;
}

/**
* Decrypt encrypted byte array using AES-GCM with 256 bits key 128 bits tag and 96 bits IV.
* Read the IV prepended to the byte array.
* @param kp public/private key pair, each in byte array.
* @param data encrypted byte array.
* @return byte array.
*/
export async function cryptoDecrypt(kp:PortableCryptoKeyPair, data:Uint8Array){
    const sizeTag = 16;
    const sizeIv = 12;

    const gcm:AesGcmParams = {
        name: "AES-GCM",
        tagLength: sizeTag * 8,
        iv: data.subarray(0, sizeIv)
    };

    const commonKey = await parseCommonKey(kp);

    return new Uint8Array(await crypto.subtle.decrypt(gcm, commonKey, data.subarray(sizeIv)));
}

/**
* Create byte array signature using the private key and SHA384 hash algorithm.
* @param k private key.
* @param data byte array.
* @return signature byte array.
*/
export async function cryptoSign(k:PortableCryptoKey, data:Uint8Array){
    const dsa:EcdsaParams = {
        name: "ECDSA",
        hash: {
            name: "SHA-384"
        }
    };

    const privateKey = await parseSignKey(k, true);

    return new Uint8Array(await crypto.subtle.sign(dsa, privateKey, data));
}

/**
* Verifies the correct signature of a byte array using the public key and SHA384 hash algorithm.
* @param signature signature byte array.
* @param k public key.
* @param data byte array.
* @return `true` if correct.
*/
export async function cryptoVerify(signature:Uint8Array, k:PortableCryptoKey, data:Uint8Array){
    const dsa:EcdsaParams = {
        name: "ECDSA",
        hash: {
            name: "SHA-384"
        }
    };

    const publicKey = await parseSignKey(k, false);

    return await crypto.subtle.verify(dsa, publicKey, signature, data);
}