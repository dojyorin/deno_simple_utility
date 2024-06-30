import {assertEquals} from "../../deps.test.ts";
import {type RawWorkBook, excelEncodeRaw, excelEncode, excelDecodeRaw, excelDecode} from "../../src/pure_ext/sheet.ts";

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
    fn(){
        const encode = excelEncode(sample1);
        const decode = excelDecode(encode);

        assertEquals(decode, sample1);
    }
});

Deno.test({
    name: "EXCEL: Raw Encode and Decode",
    fn(){
        const encode = excelEncodeRaw(sample2);
        const decode = excelDecodeRaw(encode);

        assertEquals(decode.Sheets, sample2.Sheets);
    }
});