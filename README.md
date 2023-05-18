# **Deno Simple Utility**
![actions:test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![actions:release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)

Useful snippet collection.

# Details
It's basically thin wrapper around Deno functions to improve usability, but some features are original to this module.
This section describes the original features of this module.

## Minipack
"Minipack" is file archive format original to this module.

It's structure is inspired by the famous "tar" and is minimal as an archive.

Originally developed for web browser, the purpose was to aggregate multiple files input with the HTML File API into single binary.

Therefore, there is no concept of directory or filesystem, and it's feature by simple structure that stores only the file body and file name.

The actual binary structure looks like this:

|Index|Type|Title|Size (Byte)|
|:--|:--|:--|:--|
|1|Header|NameSize|1|
|2|Header|BodySize|4|
|3|Body|FileName|Max 255 (Defined in NameSize)|
|4|Body|FileBody|Max 4294967295 (Defined in BodySize)|

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