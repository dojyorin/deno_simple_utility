import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {posixSep, winSep, isWin, tmpPath, homePath, mainPath} from "../src/platform.ts";

Deno.test({
    name: "Platform: Separator.",
    async fn(){
        const samplePosix = "C:/Windows/System32/cmd.exe";
        const sampleWin = "C:\\Windows\\System32\\cmd.exe";

        assertEquals(posixSep(sampleWin), samplePosix);
        assertEquals(winSep(samplePosix), sampleWin);
    }
});

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Platform: Directory (Windows)",
    async fn(){
        assertEquals(isWin(), true);
        assertEquals(tmpPath(), "C:/Windows/Temp");
        assertEquals(homePath(), posixSep(Deno.env.toObject().USERPROFILE));
        assertEquals(mainPath(), posixSep(fromFileUrl(dirname(Deno.mainModule))));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Platform: Directory (Linux & Mac)",
    async fn(){
        assertEquals(isWin(), false);
        assertEquals(tmpPath(), "/tmp");
        assertEquals(homePath(), Deno.env.toObject().HOME);
        assertEquals(mainPath(), fromFileUrl(dirname(Deno.mainModule)));
    }
});