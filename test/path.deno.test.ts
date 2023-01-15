import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {posixSep, winSep, tmpPath, homePath, mainPath} from "../src/path.deno.ts";

Deno.test({
    name: "Path: Separator",
    async fn(){
        const samplePosix = "C:/Windows/System32/cmd.exe";
        const sampleWin = "C:\\Windows\\System32\\cmd.exe";

        assertEquals(posixSep(sampleWin), samplePosix);
        assertEquals(winSep(samplePosix), sampleWin);
    }
});

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Path: Windows",
    async fn(){
        assertEquals(tmpPath(), "C:/Windows/Temp");
        assertEquals(homePath(), posixSep(Deno.env.toObject().USERPROFILE));
        assertEquals(mainPath(), posixSep(fromFileUrl(dirname(Deno.mainModule))));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Path: Posix",
    async fn(){
        assertEquals(tmpPath(), "/tmp");
        assertEquals(homePath(), Deno.env.toObject().HOME);
        assertEquals(mainPath(), fromFileUrl(dirname(Deno.mainModule)));
    }
});