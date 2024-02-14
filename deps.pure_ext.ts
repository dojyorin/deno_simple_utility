// @deno-types="https://deno.land/std@0.215.0/csv/mod.ts"
export {parse, stringify} from "https://esm.sh/gh/denoland/deno_std@0.215.0/csv/mod.ts?bundle&target=esnext";
// @deno-types="https://deno.land/x/zipjs@v2.7.34/index.d.ts"
export {ZipReader, ZipWriter, Uint8ArrayReader, Uint8ArrayWriter} from "https://esm.sh/gh/gildas-lormeau/zip.js@v2.7.34/index.js?bundle&target=esnext";

// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.1/package/types/index.d.ts"
export {type WorkBook as RawWorkBook, type WorkSheet as RawWorkSheet, type CellObject as RawWorkCell, set_cptable, read as xlsxRead, write as xlsxWrite, utils as xlsxUtil} from "https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs";
export * as xlsxcp from "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/cpexcel.full.mjs";