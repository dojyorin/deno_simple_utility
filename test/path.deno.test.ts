import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {posixSep, winSep, tmpPath, dataPath, homePath, mainPath} from "../src/path.deno.ts";

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
        assertEquals(dataPath(), "C:/ProgramData");
        assertEquals(homePath(), posixSep(Deno.env.toObject().USERPROFILE));
        assertEquals(mainPath(), posixSep(fromFileUrl(dirname(Deno.mainModule))));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Path: Linux and Mac",
    async fn(){
        assertEquals(tmpPath(), "/tmp");
        assertEquals(dataPath(), "/var");
        assertEquals(homePath(), Deno.env.toObject().HOME);
        assertEquals(mainPath(), fromFileUrl(dirname(Deno.mainModule)));
    }
});