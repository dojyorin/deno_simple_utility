# **Deno Simple Utility**
![actions:test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![actions:release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)

Useful snippet collection.

# Details
Collection of thin snippets to improve usability, some features are unique to this module.
This section describes the unique features of this module.

## Minipack
"Minipack" is file archive format unique to this module.

Originally developed for browser, purpose was concatenate multiple files input with DOM File API to single binary.
So no concept of filesystem, features by simple and minimal structure that stores only binary and name.

The actual binary structure looks like this:

|Index|Type|Title|Size|
|:--|:--|:--|:--|
|1|Header|NameSize|1|
|2|Header|ContentSize|4|
|3|Body|Name|Max 255 (Defined in NameSize)|
|4|Body|Content|Max 4294967295 (Defined in ContentSize)|

This structure is repeats for the number of files.

# Compatible
Collected only parts of this module that not use the `Deno` namespace and prepared as browser-compatible code to [`mod.universal.ts`](./mod.universal.ts).
You can get bundled script in [releases](https://github.com/dojyorin/deno_simple_utility/releases).

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.