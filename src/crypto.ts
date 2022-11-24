export type PortableCryptoKey = Uint8Array;

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

export async function deriveHash(data:Uint8Array){
    return new Uint8Array(await crypto.subtle.digest("SHA-512", data));
}

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