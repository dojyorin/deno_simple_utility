export function isWin(){
    const os = Deno?.build.os;

    if(!os){
        throw new Error();
    }

    return os === "windows";
}

export function tmpPath(){
    switch(Deno?.build.os){
        case "windows": return "C:/Windows/Temp";
        case "linux": return "/tmp";
        case "darwin": return "/tmp";
        default: throw new Error();
    }
}