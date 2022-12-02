# **Simple Utility for Deno**
![Actions-Test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![Actions-Release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)

A handy utility collection.

# Example

<p>
<details>
<summary>Show more details...</summary>
<p>

**BASE64 Binary**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = base64Encode(file); // base64 code.
const decoded = base64Decode(encoded); // Restored.
```

**Easy WebCrypto**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const random = await cryptoRandom(16); // random byte array.
const hash = await cryptoHash(true, file); // byte array of SHA2 512 bits hash value.
const keyEcdh = await cryptoGenerateKey(true); // public/private key pair for ECDH, each in byte array.
const keyEcdsa = await cryptoGenerateKey(false); // public/private key pair for ECDSA, each in byte array.
const encrypted = await cryptoEncrypt(keyEcdh, file); // encrypted byte array.
const decrypted = await cryptoDecrypt(keyEcdh, encrypted); // Restored.
const signature = await cryptoSign(keyEcdsa.privateKey, data); // signature byte array.
const verify = await cryptoVerify(signature, keyEcdsa.publicKey, data); // `true` if correct.
```

**Date UnixTime**

```ts
const date = new Date();

const encoded = dateEncode(date); // unixtime in seconds.
const decoded = dateDecode(encoded); // Restored.
const unixtime = dateParse(date.toISOString()); // unixtime in seconds.
```

**DEFLATE Compress**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = await deflateEncode(file); // "deflate" compressed byte array.
const decoded = await deflateDecode(encoded); // Restored.
```

**Extended Fetch API**

```ts
const json = await fetchExtend("https://path/to/get", "json"); // response as JSON.
const bytes = await fetchExtend("https://path/to/get", "byte"); // response as Uint8Array.
```

**Minipack Archive**

```ts
const files = [
    ["binary.bin", Deno.readFileSync("/path/to/binary.bin")]
];

const encoded = await minipackEncode(files); // byte array in "minipack" format.
const decoded = await minipackDecode(encoded); // Restored.
```

**Text Convert**

```ts
const text = " Lorem ipsum  \t  dolor \r sit amet.";

const encoded = ucEncode(text); // byte array in UTF-8 format.
const decoded = ucDecode(encoded); // Restored.
const hexadecimal = hexEncode(encoded); // HEX string.
const formatted = trimExtend(decoded); // formatted string.
```

**Platform Specific**

```ts
const posix = posixSep("C:\\Users"); // POSIX style (slash) path string.
const win = isWin(); // "true" if running on Windows.
const tmp = tmpPath(); // `/tmp` if running on Linux or Mac, `C:/Windows/Temp` if running on Windows.
const home = homePath(); // `$HOME` if running on Linux or Mac, `%USERPROFILE%` if running on Windows.
cwdMain(); // Move current directory to `Deno.mainModule`.
```

</p>
</details>
</p>

# Details
It's basically a thin wrapper around Deno's functions to improve usability, but some features are original to this module.

This section describes the original features of this module.

## Minipack
"Minipack" is a file archive format original to this module.

It's structure is inspired by the famous "tar" and is minimal as an archive.

Originally developed for web browser, the purpose was to aggregate multiple files input with the HTML File API into a single binary.

Therefore, there is no concept of directory or filesystem, and it's feature by simple structure that stores only the file body, file name, and hash value for verification.

The actual binary structure looks like this:

|Index|Type|Title|Size (Byte)|
|:--|:--|:--|:--|
|1|Header|HashValue|32|
|2|Header|NameSize|1|
|3|Header|BodySize|4|
|4|Body|FileName|Max 255 (Defined in NameSize)|
|5|Body|FileBody|Max 4294967295 (Defined in BodySize)|

This is for one file and repeats for the number of files.

# Browser Compatible
Some methods and classes in this module don't use `globalThis.Deno` internally and are browser compatible.

I have prepared browser compatible code only export as [mod.compatible.ts](./mod.compatible.ts).

By bundling this, you can easily create universal utility scripts.

```sh
deno bundle https://deno.land/x/simple_utility@(version)/mod.compatible.ts > ./simple_utility.esm.js
```

This section may eventually be automated with GitHub Actions, in which case the bundled scripts will be merged into GitHub Releases, making this step unnecessary.

# Tips
This section is not directly related to this module, but provides a few line snippets to help you implement your application.

<p>
<details>
<summary>Show more details...</summary>
<p>

**JSON Import with Type**

```ts
const {default: data} = await import("./data.json", {assert: {type: "json"}});
```

</p>
</details>
</p>

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.