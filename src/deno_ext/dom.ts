import {type Element, DOMParser} from "../../deps.ts";

function selectedElement(elements:Element[], attribute:"checked" | "selected"){
    return elements.find(v => typeof v.getAttribute(attribute) === "string");
}

function getValue(element?:Element){
    return element?.getAttribute("value") ?? "";
}

function extractValue(element?:Element){
    switch(element?.tagName){
        case "SELECT": return getValue(selectedElement(element.getElementsByTagName("option"), "selected"));
        case "DATALIST": return getValue(selectedElement(element.getElementsByTagName("option"), "selected"));
        case "OPTION": return getValue(element);
        case "INPUT": return getValue(element);
        case "TEXTAREA": return element.textContent;
        default: return "";
    }
}

/**
* Convert from HTML to DOM.
* @see https://deno.land/x/deno_dom
* @example
* ```ts
* const dom = domDecode("<div>foo</div>");
* ```
*/
export function domDecode(html:string):Element{
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
* const dom = domDecode("<input id='foo'>");
* const result = domValuesPerId(dom);
* ```
*/
export function domValuesPerId(element:Element):Record<string, string>{
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

        records[textarea.id] = textarea.textContent;
    }

    return structuredClone(records);
}

/**
* Get value by `id` search.
* `.value` for `<input>`, `.textContent` for `<textarea>` and `.value` of `.selected` for `<select>` `<dataset>`.
* @example
* ```ts\
* const dom = domDecode("<input id='foo'>");
* const result = domValueById(dom, "foo");
* ```
*/
export function domValueById(element:Element, id:string):string{
    return extractValue(element.getElementById(id) ?? undefined);
}

/**
* Find all elements with `name` attribute.
* @example
* ```ts
* const dom = domDecode("<input name='foo'>");
* const result = domElementsByName(dom, "foo");
* ```
*/
export function domElementsByName(element:Element, name:string):Element[]{
    return element.getElementsByTagName("*").filter(v => v.getAttribute("name") === name);
}

/**
* Get value by `name` search.
* `.value` for `<input>`, `.textContent` for `<textarea>` and `.value` of `.selected` for `<select>` `<dataset>`.
* @example
* ```ts
* const dom = domDecode("<input name='foo'>");
* const result = domValuesByName(dom, "foo");
* ```
*/
export function domValuesByName(element:Element, name:string):string[]{
    return domElementsByName(element, name).map(v => extractValue(v));
}

/**
* Get value of `.checked` in group of radio buttons.
* @example
* ```ts
* const dom = domDecode("<input type='radio' name='foo' value='1' checked><input type='radio' name='foo' value='2'>");
* const result = domValueByRadioActive(dom, "foo");
* ```
*/
export function domValueByRadioActive(element:Element, name:string):string{
    const elements = domElementsByName(element, name);

    if(elements.some(v => v.tagName !== "INPUT" || v.getAttribute("type") !== "radio")){
        return "";
    }

    return extractValue(selectedElement(elements, "checked"));
}