export type Opt<T> = Partial<Record<keyof T, unknown>>;

export function deepClone<T extends Opt<T>>(data:T):T{
    return structuredClone(data);
}

export function deepFreeze<T extends Opt<T>>(data:T):T{
    Object.freeze(data);

    for(const k in data){
        if(Object.hasOwn(data, k) && typeof data[k] === "object" && data[k] !== null && !Object.isFrozen(data[k])){
            deepFreeze(data[k]);
        }
    }

    return data;
}

export function deepSeal<T extends Opt<T>>(data:T):T{
    Object.seal(data);

    for(const k in data){
        if(Object.hasOwn(data, k) && typeof data[k] === "object" && data[k] !== null && !Object.isSealed(data[k])){
            deepSeal(data[k]);
        }
    }

    return data;
}