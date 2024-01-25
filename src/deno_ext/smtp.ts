import {createTransport} from "../../deps.deno_ext.ts";

/**
* E-MAIL message.
*/
export interface MailMessage{
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    title: string;
    body: string;
}

/**
* Send E-MAIL using SMTP.
* @example
* ```ts
* const ok = await smtpSend("smtp://smtp.example.com:25", {
*     from: "mike@xxx.com",
*     to: "john@xxx.com",
*     title: "test",
*     body: "test mail."
* });
* ```
*/
export async function smtpSend(path:string, message:MailMessage):Promise<void>{
    const {protocol, hostname, port, username, password} = new URL(path);

    if(protocol !== "smtp:" && protocol !== "smtps:"){
        throw new Error(protocol);
    }

    const smtp = createTransport({
        host: hostname,
        port: Number(port),
        secure: protocol === "smtps:",
        auth: username ? {
            user: decodeURIComponent(username),
            pass: decodeURIComponent(password),
        } : undefined
    });

    await smtp.sendMail({
        from: message.from,
        to: message.to,
        cc: message.cc,
        bcc: message.bcc,
        subject: message.title,
        text: message.body
    });

    smtp.close();
}