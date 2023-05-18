/**
* Run command as subprocess.
* @example
* ```ts
* const success = executeCommand(["echo", "foobar"]);
* ```
*/
export async function runCommand(...commands:string[]):Promise<boolean>{
    const {success} = await new Deno.Command(commands.shift() ?? "", {
        args: commands,
        stdin: "null",
        stdout: "null",
        stderr: "null"
    }).output();

    return success;
}