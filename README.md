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

**Date UnixTime**

```ts
const date = new Date();

const encoded = await dateEncode(date); // unixtime in seconds.
const decoded = await dateDecode(encoded); // Restored.
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

**Platform Specific**

```ts
const win = isWin(); // "true" if running on Windows.
const tmp = tmpPath(); // "C:/Windows/Temp" if running on Windows, or "/tmp" if running on Linux or Mac.
```

**Text Convert**

```ts
const text = " Lorem ipsum  \t  dolor \r sit amet.";

const encoded = await ucEncode(text); // byte array in UTF-8 format.
const decoded = await ucDecode(encoded); // Restored.
const hexadecimal = hexEncode(encoded); // hexadecimal string.
const formatted = trimExtend(decoded); // formatted string.
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

# Tips
This section is not directly related to this module, but provides a few line snippets to help you implement your application.

<p>
<details>
<summary>Show more details...</summary>
<p>

**JSON Import**
```ts
const {default: config} = await import("./config.json", {assert: {type: "json"}});
```

</p>
</details>
</p>

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.