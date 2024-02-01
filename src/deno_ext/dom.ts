import {type Element, DOMParser} from "../../deps.deno_ext.ts";
import {deepClone} from "../pure/deep.ts";

function selectedElement(elements:Element[], attribute:"checked" | "selected"){
    return elements.find(v => typeof v.getAttribute(attribute) === "string");
}

function getValue(element?:Element){
    return element?.getAttribute("value") ?? "";
}

function getContent({textContent}:Element){
    return textContent;
}

function extractValue(element?:Element){
    switch(element?.tagName){
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
* @see https://deno.land/x/deno_dom
* @example
* ```ts
* const dom = parseDOM("<div>foo</div>");
* ```
*/
export function parseDOM(html:string):Element{
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
* const dom = parseDOM("<input id='foo'><textarea id='bar'></textarea>");
* const result = collectInputById(dom);
* ```
*/
export function collectInputById(element:Element):Record<string, string>{
    const records:Record<string, string> = {};

    for(const input of element.getElementsByTagName("INPUT")){
        if(!input.id){
            continue;
        }

        records[input.id] = getValue(input);
    }

    for(const textarea of element.getElementsByTagName("TEXTAREA")){
        if(!textarea.id){
            continue;
        }

        records[textarea.id] = getContent(textarea);
    }

    return deepClone(records);
}

/**
* Find all elements with `name` attribute.
* @example
* ```ts
* const dom = parseDOM("<input name='foo'>");
* const result = getElementsByName(dom, "foo");
* ```
*/
export function getElementsByName(element:Element, name:string):Element[]{
    return element.getElementsByTagName("*").filter(v => v.getAttribute("name") === name);
}

/**
* Get value by `id` search.
* `.value` for `<input>`, `.textContent` for `<textarea>` and `.value` of `.selected` for `<select>` `<dataset>`.
* @example
* ```ts\
* const dom = parseDOM("<input id='foo'>");
* const result = getValueById(dom, "foo");
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
* const dom = parseDOM("<input name='foo'>");
* const result = getValuesByName(dom, "foo");
* ```
*/
export function getValuesByName(element:Element, name:string):string[]{
    return getElementsByName(element, name).map(v => extractValue(v));
}

/**
* Gets value of `.checked` in group of radio buttons.
* @example
* ```ts
* const dom = parseDOM("<input type='radio' name='foo' value='1' checked><input type='radio' name='foo' value='2'>");
* const result = getValueByRadioActive(dom, "foo");
* ```
*/
export function getValueByRadioActive(element:Element, name:string):string{
    const elements = getElementsByName(element, name);

    if(elements.some(v => v.tagName !== "INPUT" || v.getAttribute("type") !== "radio")){
        return "";
    }

    return extractValue(selectedElement(elements, "checked"));
}