/**
* Run command as subprocess.
* @example
* ```ts
* const success = await processRun("echo", "foobar");
* ```
*/
export async function processRun(...commands:string[]):Promise<boolean> {
    const {success} = await new Deno.Command(commands.shift() ?? "", {
        args: commands,
        stdin: "null",
        stdout: "null",
        stderr: "null"
    }).output();

    return success;
}