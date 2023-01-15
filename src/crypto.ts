/**
* Means the byte array after exporting `CryptoKey`.
*/
export type PortableCryptoKey = Uint8Array;

/**
* Each is `PortableCryptoKey` public/private key pair.
*/
export type PortableCryptoKeyPair = Record<keyof CryptoKeyPair, PortableCryptoKey>;

const sizeTag = 16;
const sizeIv = 12;

function generateAesGcmConfig(tag:number, iv:Uint8Array){
    return <AesGcmParams>{
        name: "AES-GCM",
        tagLength: tag * 8,
        iv: iv
    };
}

function generateEcKeyConfig(isECDH:boolean){
    return <EcKeyAlgorithm>{
        name: isECDH ? "ECDH" : "ECDSA",
        namedCurve: "P-521"
    };
}

function generateEcDsaConfig(){
    return <EcdsaParams>{
        name: "ECDSA",
        hash: {
            name: "SHA-512"
        }
    };
}

async function deriveSecretKey(kp:PortableCryptoKeyPair){
    const ec = generateEcKeyConfig(true);
    const publicKey = await crypto.subtle.importKey("spki", kp.publicKey, ec, false, []);
    const privateKey = await crypto.subtle.importKey("pkcs8", kp.privateKey, ec, false, ["deriveKey", "deriveBits"]);

    const aes:AesDerivedKeyParams = {
        name: "AES-GCM",
        length: 256
    };

    const dh:EcdhKeyDeriveParams = {
        name: "ECDH",
        public: publicKey
    };

    return await crypto.subtle.deriveKey(dh, privateKey, aes, false, ["encrypt", "decrypt"]);
}

/**
* Returns random UUID.
* @return random UUID.
*/
export function cryptoUuid(){
    return crypto.randomUUID();
}

/**
* Returns random byte array with the specified number of bytes.
* @param size number of bytes.
* @return random byte array.
*/
export function cryptoRandom(size:number){
    return crypto.getRandomValues(new Uint8Array(size));
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
    const ec = generateEcKeyConfig(isECDH);
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
    const gcm = generateAesGcmConfig(sizeTag, cryptoRandom(sizeIv));
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
    const gcm = generateAesGcmConfig(sizeTag, data.subarray(0, sizeIv));
    const secretKey = await deriveSecretKey(kp);

    return new Uint8Array(await crypto.subtle.decrypt(gcm, secretKey, data.subarray(sizeIv)));
}

/**
* Create byte array signature using the private key and SHA2 hash algorithm.
* @param k private key.
* @param data byte array.
* @return signature byte array.
*/
export async function cryptoSign(k:PortableCryptoKey, data:Uint8Array){
    const ec = generateEcKeyConfig(false);
    const dsa = generateEcDsaConfig();
    const privateKey = await crypto.subtle.importKey("pkcs8", k, ec, false, ["sign"]);

    return new Uint8Array(await crypto.subtle.sign(dsa, privateKey, data));
}

/**
* Verifies the correct signature of a byte array using the public key and SHA2 hash algorithm.
* @param signature signature byte array.
* @param k public key.
* @param data byte array.
* @return `true` if correct.
*/
export async function cryptoVerify(signature:Uint8Array, k:PortableCryptoKey, data:Uint8Array){
    const ec = generateEcKeyConfig(false);
    const dsa = generateEcDsaConfig();
    const publicKey = await crypto.subtle.importKey("spki", k, ec, false, ["verify"]);

    return await crypto.subtle.verify(dsa, publicKey, signature, data);
}