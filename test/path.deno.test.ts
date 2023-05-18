import {assertEquals, dirname, fromFileUrl} from "../deps.test.ts";
import {slashUnix, slashWin, tmpPath, dataPath, homePath, mainPath} from "../src/path.deno.ts";

Deno.test({
    name: "Path: Separator",
    async fn(){
        const sampleUnix = "C:/Windows/System32/cmd.exe";
        const sampleWindows = "C:\\Windows\\System32\\cmd.exe";

        assertEquals(slashUnix(sampleWindows), sampleUnix);
        assertEquals(slashWin(sampleUnix), sampleWindows);
    }
});

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Path: Windows",
    async fn(){
        assertEquals(tmpPath(), "C:/Windows/Temp");
        assertEquals(dataPath(), "C:/ProgramData");
        assertEquals(homePath(), slashUnix(Deno.env.toObject().USERPROFILE));
        assertEquals(mainPath(), slashUnix(fromFileUrl(dirname(Deno.mainModule))));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Path: Unix",
    async fn(){
        assertEquals(tmpPath(), "/tmp");
        assertEquals(dataPath(), "/var");
        assertEquals(homePath(), Deno.env.toObject().HOME);
        assertEquals(mainPath(), fromFileUrl(dirname(Deno.mainModule)));
    }
});