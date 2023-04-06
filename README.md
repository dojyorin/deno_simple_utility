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

const base64text = base64Encode(file);
const binary = base64Decode(base64text);
```

**Easy WebCrypto**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const uuid = cryptoUuid();
const random = cryptoRandom(16);
const hash = await cryptoHash(true, file);
const keyEcdh = await cryptoGenerateKey(true);
const keyEcdsa = await cryptoGenerateKey(false);
const encrypted = await cryptoEncrypt(keyEcdh, file);
const decrypted = await cryptoDecrypt(keyEcdh, encrypted);
const signature = await cryptoSign(keyEcdsa.privateKey, data);
const verify = await cryptoVerify(signature, keyEcdsa.publicKey, data);
```

**DEFLATE Compress**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const deflated = await deflateEncode(file);
const inflated = await deflateDecode(deflated);
```

**Extended Fetch API**

```ts
const json = await fetchExtend("https://path/to/get", "json");
const binary = await fetchExtend("https://path/to/get", "byte");
```

**Minipack Archive**

```ts
const files = [
    ["binary.bin", Deno.readFileSync("/path/to/binary.bin")]
];

const packed = await minipackEncode(files);
const unpacked = await minipackDecode(packed);
```

**Text Convert**

```ts
const text = " Lorem ipsum  \t  dolor \r sit amet.";

const binary1 = utfEncode(text);
const original = utfDecode(binary1);
const hextext = hexEncode(binary1);
const binary2 = hexDecode(hextext);
const formatted = trimExtend(text);
const emojis = accurateSegment("😄😁😆😅😂");
```

**UnixTime Date**

```ts
const time1 = unixtimeEncode();
const date = unixtimeDecode(time1);
const time2 = unixtimeParse(date.toISOString());
```

**Path Operation (Deno Only)**

```ts
const slash = unixSep("C:\\Users\\Administrator");
const backslash = windowsSep("C:/Users/Administrator");
const tmpdir = tmpPath();
const datadir = dataPath();
const homedir = homePath();
const maindir = mainPath();
```

**Platform Specific (Deno Only)**

```ts
const iswindows = isWindows();
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

I have prepared browser compatible code only export as [mod.universal.ts](./mod.universal.ts).

You can get bundled script in [releases](https://github.com/dojyorin/deno_simple_utility/releases).

</p>
</details>
</p>

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.