import {assertEquals} from "../../deps.test.ts";
import {isWin} from "../../src/deno/platform.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Windows",
    fn(){
        assertEquals(isWin(), true);
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Unix",
    fn(){
        assertEquals(isWin(), false);
    }
});