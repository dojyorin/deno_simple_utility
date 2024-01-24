/**
* Define import assertion on dynamic import.
* Default to JSON.
* @example
* ```ts
* const {default: json} = await import("./data.json", importAssert());
* ```
*/
export function importAssert(type?:string):ImportCallOptions{
    return {
        assert: {
            type: type ?? "json"
        }
    };
}