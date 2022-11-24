import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {isWin, tmpPath, cwdMain} from "../src/platform.ts";

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

Deno.test({
    name: "Platform: CWD.",
    async fn(){
        const backup = Deno.cwd();

        cwdMain();

        assertEquals(fromFileUrl(dirname(Deno.mainModule), Deno.cwd()));

        Deno.chdir(backup);
    }
});