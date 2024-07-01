import {assertEquals} from "../../deps.test.ts";
import {type RawWorkBook, sheetEncodeRaw, sheetEncode, sheetDecodeRaw, sheetDecode} from "../../src/pure_ext/sheet.ts";

const sample1 = {
    "test": [
        ["foo", "bar"]
    ]
};

const sample2:RawWorkBook = {
    SheetNames: ["test"],
    Sheets: {
        "test": {
            "!ref": "A1",
            "!data": [
                [{
                    t: "s",
                    v: "foo",
                    h: "foo",
                    w: "foo",
                    z: "General",
                    s: {
                        patternType: "none"
                    }
                }]
            ]
        }
    }
};

Deno.test({
    name: "EXCEL: Encode and Decode",
    fn() {
        const encode = sheetEncode(sample1);
        const decode = sheetDecode(encode);

        assertEquals(decode, sample1);
    }
});

Deno.test({
    name: "EXCEL: Raw Encode and Decode",
    fn() {
        const encode = sheetEncodeRaw(sample2);
        const decode = sheetDecodeRaw(encode);

        assertEquals(decode.Sheets, sample2.Sheets);
    }
});