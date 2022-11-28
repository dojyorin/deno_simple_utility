/**
* Means the byte array after exporting `CryptoKey`.
*/
export type PortableCryptoKey = Uint8Array;

/**
* Each is `PortableCryptoKey` public/private key pair.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, PortableCryptoKey>;

const sizeKey = 32;
const sizeTag = 16;
const sizeIv = 12;

const nameEc = "P-384";
const nameMac = "SHA-384";

async function deriveSecretKey(kp:PortableCryptoKeyPair){
    const ec:EcKeyAlgorithm = {
        name: "ECDH",
        namedCurve: nameEc
    };

    const aes:AesDerivedKeyParams = {
        name: "AES-GCM",
        length: sizeKey * 8
    };

    const publicKey = await crypto.subtle.importKey("spki", kp.publicKey, ec, false, []);
    const privateKey = await crypto.subtle.importKey("pkcs8", kp.privateKey, ec, false, ["deriveKey", "deriveBits"]);

    const dh:EcdhKeyDeriveParams = {
        name: "ECDH",
        public: publicKey
    };

    return await crypto.subtle.deriveKey(dh, privateKey, aes, false, ["encrypt", "decrypt"]);
}

/**
* Returns random byte array with the specified number of bytes.
* @param size number of bytes.
* @return random byte array.
*/
export async function cryptoRandom(size:number){
    return await new Promise<Uint8Array>(done => done(crypto.getRandomValues(new Uint8Array(size))));
}

/**
* Derive SHA2 hash value from byte array.
* @param is512 Use the hash length 512 bits if `true`, 256 bits if `false`.
* @param data byte array.
* @return byte array of hash value.
*/
export async function cryptoHash(is512:boolean, data:Uint8Array){
    const sha = is512 ? "SHA-512" : "SHA-256";

    return new Uint8Array(await crypto.subtle.digest(sha, data));
}

/**
* Generate and export public/private key pair as a portable byte array.
* @param isECDH Outputs the key for ECDH if `true`, for ECDSA if `false`.
* @return public/private key pair, each in byte array.
*/
export async function cryptoGenerateKey(isECDH:boolean){
    const usage:KeyUsage[] = isECDH ? ["deriveKey", "deriveBits"] : ["sign", "verify"];

    const ec:EcKeyAlgorithm = {
        name: isECDH ? "ECDH" : "ECDSA",
        namedCurve: nameEc
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
    const gcm:AesGcmParams = {
        name: "AES-GCM",
        tagLength: sizeTag * 8,
        iv: await cryptoRandom(sizeIv)
    };

    const secretKey = await deriveSecretKey(kp);

    const output = new Uint8Array(sizeTag + sizeIv + data.byteLength);
    output.set(<Uint8Array>gcm.iv, 0);
    output.set(new Uint8Array(await crypto.subtle.encrypt(gcm, secretKey, data)), gcm.iv.byteLength);

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
    const gcm:AesGcmParams = {
        name: "AES-GCM",
        tagLength: sizeTag * 8,
        iv: data.subarray(0, sizeIv)
    };

    const commonKey = await deriveSecretKey(kp);

    return new Uint8Array(await crypto.subtle.decrypt(gcm, commonKey, data.subarray(sizeIv)));
}

/**
* Create byte array signature using the private key and SHA384 hash algorithm.
* @param k private key.
* @param data byte array.
* @return signature byte array.
*/
export async function cryptoSign(k:PortableCryptoKey, data:Uint8Array){
    const ec:EcKeyAlgorithm = {
        name: "ECDSA",
        namedCurve: nameEc
    };

    const dsa:EcdsaParams = {
        name: "ECDSA",
        hash: {
            name: nameMac
        }
    };

    const privateKey = await crypto.subtle.importKey("pkcs8", k, ec, false, ["sign"]);

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
    const ec:EcKeyAlgorithm = {
        name: "ECDSA",
        namedCurve: nameEc
    };

    const dsa:EcdsaParams = {
        name: "ECDSA",
        hash: {
            name: nameMac
        }
    };

    const publicKey = await crypto.subtle.importKey("spki", k, ec, false, ["verify"]);

    return await crypto.subtle.verify(dsa, publicKey, signature, data);
}