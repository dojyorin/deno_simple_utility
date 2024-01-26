import {assertEquals, dirname, fromFileUrl} from "../../deps.test.ts";
import {slashU, slashW, tmpPath, dataPath, homePath, mainPath} from "../../src/deno/path.ts";

const {HOME, USERPROFILE} = Deno.env.toObject();
const ep = `${fromFileUrl(dirname(Deno.mainModule))}/`;

Deno.test({
    name: "Path: Separator",
    fn(){
        const sampleUnix = "C:/Windows/System32/cmd.exe";
        const sampleWindows = "C:\\Windows\\System32\\cmd.exe";

        assertEquals(slashU(sampleWindows), sampleUnix);
        assertEquals(slashW(sampleUnix), sampleWindows);
    }
});

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Path: Windows",
    fn(){
        assertEquals(tmpPath(), "C:/Windows/Temp");
        assertEquals(dataPath(), "C:/ProgramData");
        assertEquals(homePath(), slashU(USERPROFILE));
        assertEquals(mainPath(), slashU(ep));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Path: Unix",
    fn(){
        assertEquals(tmpPath(), "/tmp");
        assertEquals(dataPath(), "/var");
        assertEquals(homePath(), HOME);
        assertEquals(mainPath(), ep);
    }
});