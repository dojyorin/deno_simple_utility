import {assertEquals} from "../../deps.test.ts";
import {osWindows, osMac, osLinux} from "../../src/deno/os.ts";

Deno.test({
    ignore: Deno.build.os !== "windows",
    name: "OS: Windows",
    fn(){
        assertEquals(osWindows, true);
        assertEquals(osMac, false);
        assertEquals(osLinux, false);
    }
});

Deno.test({
    ignore: Deno.build.os !== "darwin",
    name: "OS: Mac",
    fn(){
        assertEquals(osWindows, false);
        assertEquals(osMac, true);
        assertEquals(osLinux, false);
    }
});

Deno.test({
    ignore: Deno.build.os !== "linux",
    name: "OS: Linux",
    fn(){
        assertEquals(osWindows, false);
        assertEquals(osMac, false);
        assertEquals(osLinux, true);
    }
});