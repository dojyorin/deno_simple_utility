import {assertEquals} from "../deps.test.ts";
import {isWin, tmpPath} from "../src/platform.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Temporary (Windows)",
    async fn(){
        assertEquals(isWin(), true);
        assertEquals(tmpPath(), "C:/Windows/Temp");
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Temporary (Linux & Mac)",
    async fn(){
        assertEquals(isWin(), false);
        assertEquals(tmpPath(), "/tmp");
    }
});