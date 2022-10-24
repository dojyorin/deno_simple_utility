# **Simple Utility for Deno**
![Actions-Test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![Actions-Release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)

A small and handy utility collection.

# Example
**BASE64 Binary**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = base64Encode(file); // BASE64 encoded string.
const decoded = base64Decode(encoded); // Restored byte array.
```

**DEFLATE Compress**

```ts
const file = await Deno.readFile("/path/to/binary.bin");

const encoded = await deflateEncode(file); // DEFLATE compressed byte array.
const decoded = await deflateDecode(encoded); // Restored byte array.
```

**Extended Fetch API**

```ts
const json = await fetchExtend("https://path/to/get", "json"); // Response as JSON.
const bytes = await fetchExtend("https://path/to/get", "byte"); // Response as Uint8Array.
```

**Minipack Archive**

```ts
const files = [{
    body: await Deno.readFile("/path/to/binary.bin"),
    name: "binary.bin"
}].map(({body, name}) => new File([body], name));

const encoded = await minipackEncode(files); // Minipack archived byte array.
const decoded = await minipackDecode(encoded); // Restored file array.
```

# Details

# API