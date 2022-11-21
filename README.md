# **Simple Utility for Deno**
![Actions-Test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![Actions-Release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)

A handy utility collection.

# Example
**BASE64 Binary**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = base64Encode(file); // BASE64 encoded string.
const decoded = base64Decode(encoded); // Restored byte.
```

**Date UnixTime**

```ts
const date = new Date();

const encoded = await dateEncode(date); // UTC unix time.
const decoded = await dateDecode(encoded); // Restored Date object.
```

**DEFLATE Compress**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = await deflateEncode(file); // DEFLATE compressed byte.
const decoded = await deflateDecode(encoded); // Restored byte.
```

**Extended Fetch API**

```ts
const json = await fetchExtend("https://path/to/get", "json"); // Response as JSON.
const bytes = await fetchExtend("https://path/to/get", "byte"); // Response as Uint8Array.
```

**Minipack Archive**

```ts
const files = [
    ["binary.bin", Deno.readFileSync("/path/to/binary.bin")]
];

const encoded = await minipackEncode(files); // Minipack archived byte.
const decoded = await minipackDecode(encoded); // Restored array of name and byte.
```

**Text Convert**

```ts
const text = " Lorem ipsum  \t  dolor \r sit amet.";

const encoded = await ucEncode(text); // UTF-8 byte.
const decoded = await ucDecode(encoded); // Restored string.
const trimmed = trimExtend(decoded); // Trimmed string.
const hex = hexEncode(encoded); // Hex string.
```

# Details
It's basically a thin wrapper around Deno's functions to improve usability, but some features are original to this module.

This section describes the original features of this module.

## Minipack
Minipack is a file archive format original to this module.

It's structure is inspired by the famous "tar" and is minimal as an archive.

Originally developed for browsers, the purpose was to aggregate multiple files input with the HTML File API into a single file.

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

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.