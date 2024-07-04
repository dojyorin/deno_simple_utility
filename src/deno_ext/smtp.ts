import {createTransport} from "../../deps.ts";
import {type DataEntry} from "../pure/minipack.ts";

/**
* E-MAIL message.
*/
export interface MailMessage {
    from: string;
    to: string[];
    title: string;
    body: string;
    cc?: string[];
    bcc?: string[];
    files?: DataEntry[];
}

/**
* Send E-MAIL using SMTP.
* @see https://www.npmjs.com/package/nodemailer
* @example
* ```ts
* await smtpSend("smtp://smtp.example.com:25", {
*     from: "mike@example.com",
*     to: ["john@example.com"],
*     title: "test",
*     body: "test mail."
* });
* ```
*/
export async function smtpSend(path: string, message: MailMessage): Promise<void> {
    const {protocol, hostname, port, username, password} = new URL(path);

    if(protocol !== "smtp:" && protocol !== "smtps:") {
        throw new Error(protocol);
    }

    const smtp = createTransport({
        host: hostname,
        port: parseInt(port),
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
        text: message.body,
        attachments: <typeof smtp.options.attachments> message.files?.map(({name, body}) => ({filename: name, content: body}))
    });

    smtp.close();
}