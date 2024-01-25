import {type Element, DOMParser} from "../../deps.deno_ext.ts";
import {deepClone} from "../pure/deep.ts";
import {cleanText} from "../pure/text.ts";

function selectedElement(elements:Element[], attribute:"checked" | "selected"){
    return elements.find(e => typeof e.getAttribute(attribute) === "string");
}

function getContent({textContent}:Element){
    return cleanText(textContent);
}

function getValue(element?:Element){
    return cleanText(element?.getAttribute("value") ?? "");
}

function extractValue(element?:Element){
    if(!element){
        return "";
    }

    switch(element.tagName){
        case "SELECT": return getValue(selectedElement(element.getElementsByTagName("option"), "selected"));
        case "DATALIST": return getValue(selectedElement(element.getElementsByTagName("option"), "selected"));
        case "OPTION": return getValue(element);
        case "INPUT": return getValue(element);
        case "TEXTAREA": return getContent(element);
        default: return "";
    }
}

/**
* Convert from HTML to DOM.
* @example
* ```ts
* const html = "<div>foo</div>";
* const element = parseHtml(html);
* ```
*/
export function parseHtml(html:string):Element{
    const element = new DOMParser().parseFromString(html, "text/html")?.documentElement;

    if(!element){
        throw new Error();
    }

    return element;
}

/**
* Find all `input` `textarea` elements with `id` attribute and convert them to key-value record.
* @example
* ```ts
* const html = "<input id='foo'><textarea id='bar'></textarea>";
* const element = parseHtml(html);
* const result = collectInputById(element);
* ```
*/
export function collectInputById(element:Element):Record<string, string>{
    const records:Record<string, string> = {};

    for(const e of element.getElementsByTagName("INPUT")){
        if(!e.id){
            continue;
        }

        records[e.id] = getValue(e);
    }

    for(const e of element.getElementsByTagName("TEXTAREA")){
        if(!e.id){
            continue;
        }

        records[e.id] = getContent(e);
    }

    return deepClone(records);
}

/**
* Find all elements with `name` attribute.
* @example
* ```ts
* const html = "<input name='foo'>";
* const element = parseHtml(html);
* const result = getElementsByName(element, "foo");
* ```
*/
export function getElementsByName(element:Element, name:string):Element[]{
    return element.getElementsByTagName("*").filter(e => e.getAttribute("name") === name);
}

/**
* Get value by `id` search.
* `.value` for `<input>`, `.textContent` for `<textarea>` and `.value` of `.selected` for `<select>` `<dataset>`.
* @example
* ```ts
* const html = "<input id='foo'>";
* const element = parseHtml(html);
* const result = getValueById(element, "foo");
* ```
*/
export function getValueById(element:Element, id:string):string{
    return extractValue(element.getElementById(id) ?? undefined);
}

/**
* Get value by `name` search.
* `.value` for `<input>`, `.textContent` for `<textarea>` and `.value` of `.selected` for `<select>` `<dataset>`.
* @example
* ```ts
* const html = "<input name='foo'>";
* const element = parseHtml(html);
* const result = getValuesByName(element, "foo");
* ```
*/
export function getValuesByName(element:Element, name:string):string[]{
    return getElementsByName(element, name).map(e => extractValue(e));
}

/**
* Gets value of `.checked` in group of radio buttons.
* @example
* ```ts
* const html = "<input type='radio' name='foo' value='1' checked><input type='radio' name='foo' value='2'>";
* const element = parseHtml(html);
* const result = getValueByRadioActive(element, "foo");
* ```
*/
export function getValueByRadioActive(element:Element, name:string):string{
    const elements = getElementsByName(element, name);

    if(elements.some(e => e.tagName !== "INPUT" || e.getAttribute("type") !== "radio")){
        return "";
    }

    return extractValue(selectedElement(elements, "checked"));
}