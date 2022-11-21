export type JsonStruct = string | number | boolean | null | JsonStruct[] | {
    [key: string]: JsonStruct;
};

export type QueryInit = Exclude<HeadersInit, Headers> | URLSearchParams;