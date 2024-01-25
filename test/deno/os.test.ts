import {assertEquals} from "../../deps.test.ts";
import {osWin} from "../../src/deno/os.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Windows",
    fn(){
        assertEquals(osWin, true);
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Unix",
    fn(){
        assertEquals(osWin, false);
    }
});