import {assertEquals, dirname, fromFileUrl} from "../../deps.test.ts";
import {pathSepL, pathSepW, pathTmp, pathVar, pathConfig, pathHome, pathMain} from "../../src/deno/path.ts";

const {HOME, USERPROFILE} = Deno.env.toObject();
const ep = `${fromFileUrl(dirname(Deno.mainModule))}/`;

Deno.test({
    name: "Path: Separator",
    fn(){
        const sampleUnix = "C:/Windows/System32/cmd.exe";
        const sampleWindows = "C:\\Windows\\System32\\cmd.exe";

        assertEquals(pathSepL(sampleWindows), sampleUnix);
        assertEquals(pathSepW(sampleUnix), sampleWindows);
    }
});

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "Path: Windows",
    fn(){
        assertEquals(pathTmp(), "C:/Windows/Temp");
        assertEquals(pathVar(), "C:/ProgramData");
        assertEquals(pathConfig(), `${pathSepL(USERPROFILE)}/AppData/Roaming`);
        assertEquals(pathHome(), pathSepL(USERPROFILE));
        assertEquals(pathMain(), pathSepL(ep));
    }
});

Deno.test({
    ignore: Deno.build.os === "windows",
    name: "Path: Unix",
    fn(){
        assertEquals(pathTmp(), "/tmp");
        assertEquals(pathVar(), "/var");
        assertEquals(pathConfig(), `${HOME}/.config`);
        assertEquals(pathHome(), HOME);
        assertEquals(pathMain(), ep);
    }
});