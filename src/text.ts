/**
* Convert from string to UTF-8 binary.
* @example
* ```ts
* const text = "HelloWorld!";
* const converted = utfEncode(text);
* const restored = utfDecode(converted);
* ```
*/
export function utfEncode(data:string):Uint8Array{
    return new TextEncoder().encode(data);
}

/**
* Convert from UTF-8 binary to string.
* @example
* ```ts
* const text = "HelloWorld!";
* const converted = utfEncode(text);
* const restored = utfDecode(converted);
* ```
*/
export function utfDecode(data:Uint8Array):string{
    return new TextDecoder().decode(data);
}

/**
* Convert from binary to hex string.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = hexEncode(bin);
* const restored = hexDecode(converted);
* ```
*/
export function hexEncode(data:Uint8Array):string{
    return [...data].map(n => pad0(n, 2, 16)).join("");
}

/**
* Convert from hex string to binary.
* @example
* ```ts
* const bin = await Deno.readFile("./file");
* const converted = hexEncode(bin);
* const restored = hexDecode(converted);
* ```
*/
export function hexDecode(data:string):Uint8Array{
    return new Uint8Array(data.match(/[0-9a-fA-F]{2}/g)?.map(s => Number(`0x${s}`)) ?? []);
}

/**
* Trim head and tail blank, remove CR and consecutive space (tab, LF) to single space (tab, LF).
* @example
* ```ts
* const text = "  Lorem ipsum\r dolor   sit  \r\r amet. ";
* const formated = trimExtend(text);
* ```
*/
export function trimExtend(data:string):string{
    return data.trim().replace(/\r/g, "").replace(/ +/g, " ").replace(/\t+/g, "\t").replace(/\n+/g, "\n").replace(/^ /mg, "").replace(/ $/mg, "");
}

/**
* Convert half-width Japanese kana to full-width and full-width alphanumeric symbols to half-width.
* @example
* ```ts
* const text = "１＋１＝２";
* const formated = fixWidth(text);
* ```
*/
export function fixWidth(data:string){
    return Object.entries({
        "ｳﾞ": "ヴ",
        "ｶﾞ": "ガ", "ｷﾞ": "ギ", "ｸﾞ": "グ", "ｹﾞ": "ゲ", "ｺﾞ": "ゴ",
        "ｻﾞ": "ザ", "ｼﾞ": "ジ", "ｽﾞ": "ズ", "ｾﾞ": "ゼ", "ｿﾞ": "ゾ",
        "ﾀﾞ": "ダ", "ﾁﾞ": "ヂ", "ﾂﾞ": "ヅ", "ﾃﾞ": "デ", "ﾄﾞ": "ド",
        "ﾊﾞ": "バ", "ﾋﾞ": "ビ", "ﾌﾞ": "ブ", "ﾍﾞ": "ベ", "ﾎﾞ": "ボ",
        "ﾊﾟ": "パ", "ﾋﾟ": "ピ", "ﾌﾟ": "プ", "ﾍﾟ": "ペ", "ﾎﾟ": "ポ",
        "ｱ": "ア", "ｲ": "イ", "ｳ": "ウ", "ｴ": "エ", "ｵ": "オ",
        "ｶ": "カ", "ｷ": "キ", "ｸ": "ク", "ｹ": "ケ", "ｺ": "コ",
        "ｻ": "サ", "ｼ": "シ", "ｽ": "ス", "ｾ": "セ", "ｿ": "ソ",
        "ﾀ": "タ", "ﾁ": "チ", "ﾂ": "ツ", "ﾃ": "テ", "ﾄ": "ト",
        "ﾅ": "ナ", "ﾆ": "ニ", "ﾇ": "ヌ", "ﾈ": "ネ", "ﾉ": "ノ",
        "ﾊ": "ハ", "ﾋ": "ヒ", "ﾌ": "フ", "ﾍ": "ヘ", "ﾎ": "ホ",
        "ﾏ": "マ", "ﾐ": "ミ", "ﾑ": "ム", "ﾒ": "メ", "ﾓ": "モ",
        "ﾔ": "ヤ", "ﾕ": "ユ", "ﾖ": "ヨ",
        "ﾗ": "ラ", "ﾘ": "リ", "ﾙ": "ル", "ﾚ": "レ", "ﾛ": "ロ",
        "ﾜ": "ワ", "ｦ": "ヲ", "ﾝ": "ン",
        "ｧ": "ァ", "ｨ": "ィ", "ｩ": "ゥ", "ｪ": "ェ", "ｫ": "ォ",
        "ｯ": "ッ",
        "ｬ": "ャ", "ｭ": "ュ", "ｮ": "ョ",
        "､": "、", "｡": "。", "･": "・", "ｰ": "ー", "｢": "「", "｣": "」",
        "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E", "Ｆ": "F", "Ｇ": "G", "Ｈ": "H", "Ｉ": "I", "Ｊ": "J", "Ｋ": "K", "Ｌ": "L", "Ｍ": "M",
        "Ｎ": "N", "Ｏ": "O", "Ｐ": "P", "Ｑ": "Q", "Ｒ": "R", "Ｓ": "S", "Ｔ": "T", "Ｕ": "U", "Ｖ": "V", "Ｗ": "W", "Ｘ": "X", "Ｙ": "Y", "Ｚ": "Z",
        "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e", "ｆ": "f", "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j", "ｋ": "k", "ｌ": "l", "ｍ": "m",
        "ｎ": "n", "ｏ": "o", "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t", "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y", "ｚ": "z",
        "０": "0", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9",
        "！": "!", "＂": "\"", "＃": "#", "＄": "$", "％": "%", "＆": "&", "＇": "'", "（": "(", "）": ")", "＊": "*", "＋": "+", "，": ",", "－": "-", "．": ".", "／": "/", "：": ":",
        "；": ";", "＜": "<", "＝": "=", "＞": ">", "？": "?", "＠": "@", "［": "[", "＼": "\\", "］": "]", "＾": "^", "＿": "_", "｀": "`", "｛": "{", "｜": "|", "｝": "}", "～": "~", "　": " "
    }).reduce((text, [k, v]) => text.replace(new RegExp(k, "g"), v), data);
}

/**
* Clean up text with `fixWidth()` and `trimExtend()`.
* @example
* ```ts
* const text = "１  ＋  １  ＝  ２  ";
* const formated = cleanText(text);
* ```
*/
export function cleanText(data:string){
    return trimExtend(fixWidth(data));
}

/**
* Accurately recognize string that contain character above `0x010000` and array them one by character.
* Useful for calculate number of characters with string contains emoji.
* @example
* ```ts
* const text = "😀😃😄😁😆😅😂🤣";
* const characters = accurateSegment(text);
* ```
*/
export function accurateSegment(data:string):string[]{
    return [...new Intl.Segmenter().segment(data)].map(({segment}) => segment);
}

/**
* Create string with zero padding at beginning of number.
* Output is 2 digits by default.
* @example
* ```ts
* const num = 8;
* const padding = pad0(num);
* ```
*/
export function pad0(data:number, digit?:number, radix?:number){
    return data.toString(radix).toUpperCase().padStart(digit ?? 2, "0");
}