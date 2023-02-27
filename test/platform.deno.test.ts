import {assertEquals} from "../deps.test.ts";
import {isWindows} from "../src/platform.deno.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Windows",
    async fn(){
        assertEquals(isWindows(), true);
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Posix",
    async fn(){
        assertEquals(isWindows(), false);
    }
});