import {assertEquals} from "../deps.test.ts";
import {isWin} from "../src/platform.deno.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Windows",
    fn(){
        assertEquals(isWin(), true);
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Posix",
    fn(){
        assertEquals(isWin(), false);
    }
});