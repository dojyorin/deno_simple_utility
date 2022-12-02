import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {posixSep, isWin, tmpPath, homePath, cwdMain} from "../src/platform.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Directory (Windows)",
    async fn(){
        assertEquals(isWin(), true);
        assertEquals(tmpPath(), "C:/Windows/Temp");
        assertEquals(homePath(), posixSep(Deno.env.toObject().USERPROFILE));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Directory (Linux & Mac)",
    async fn(){
        assertEquals(isWin(), false);
        assertEquals(tmpPath(), "/tmp");
        assertEquals(homePath(), Deno.env.toObject().HOME);
    }
});

Deno.test({
    name: "Platform: CWD.",
    async fn(){
        const backup = Deno.cwd();

        cwdMain();

        assertEquals(fromFileUrl(dirname(Deno.mainModule)), Deno.cwd());

        Deno.chdir(backup);
    }
});