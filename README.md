# **Deno Simple Utility**
![actions:test](https://github.com/dojyorin/deno_simple_utility/actions/workflows/test.yaml/badge.svg)
![actions:release](https://github.com/dojyorin/deno_simple_utility/actions/workflows/release.yaml/badge.svg)
![shields:license](https://img.shields.io/github/license/dojyorin/deno_simple_utility)
![shields:release](https://img.shields.io/github/release/dojyorin/deno_simple_utility)
![deno:module](https://shield.deno.dev/x/simple_utility)

Useful snippet collection.

# Details
Collection of utilities to improve usability.

### Minipack
"Minipack" is file archive format unique to this module.

Originally developed for browser, purpose was concatenate multiple files input with DOM File API to single binary.
So no concept of filesystem, features by simple and minimal structure that stores only binary and name.

Actual binary structure looks like this:

|Index|Label|Size (byte)|
|:--|:--|:--|
|1|NameSize|1|
|2|BodySize|4|
|3|Name|Max 255 (by NameSize)|
|4|Body|Max 4294967295 (by BodySize)|

This structure is repeats for number of files.

# Export
This module has several variations depending on usage.

|Module<br>Name|All<br>Features|No<br>Dependency|Browser<br>Compatible|Description|
|:--|:-:|:-:|:-:|:--|
|[`mod.ts`](./mod.ts)|➖|✅|➖|Most standard, basically using with Deno.|
|[`mod.full.ts`](./mod.full.ts)|✅|➖|➖|All features available.|
|[`mod.pure.ts`](./mod.pure.ts)|➖|✅|✅|Without `Deno`, basically using with browser.|
|[`mod.pure.full.ts`](./mod.pure.full.ts)|✅|➖|✅|All features of pure script available.|

Export without external dependencies have fewer features than full, but not susceptible to external module vulnerabilities.

When used in browser available via [esm.sh](https://esm.sh).

```html
<script>
    import {fetchExtend} from "https://esm.sh/gh/dojyorin/deno_simple_utility@version/mod.pure.ts?bundle&target=esnext";
</script>
```

# API
See [Deno Document](https://deno.land/x/simple_utility/mod.ts) for details.