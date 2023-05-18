/**
* Run command as subprocess.
* @example
* const success = executeCommand(["echo", "foobar"]);
*/
export async function runCommand(...commands:string[]){
    const {success} = await new Deno.Command(commands.shift() ?? "", {
        args: commands,
        stdin: "null",
        stdout: "null",
        stderr: "null"
    }).output();

    return success;
}