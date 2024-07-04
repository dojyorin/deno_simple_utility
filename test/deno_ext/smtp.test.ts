import {assertEquals, delay, smtpTest} from "../../deps.test.ts";
import {type MailMessage, smtpSend} from "../../src/deno_ext/smtp.ts";

const sample: MailMessage = {
    from: "from@example.com",
    to: ["to@example.com"],
    title: "Test title",
    body: "Test body"
};

Deno.test({
    name: "SMTP: Send",
    async fn() {
        const server = smtpTest(10025);
        const result = new Promise<MailMessage>((res) => {
            server.bind((_, __, {headers, body}) => {
                res({
                    from: <string> headers.from,
                    to: [<string> headers.to],
                    title: <string> headers.subject,
                    body: body ?? ""
                });
            });
        });

        await smtpSend("smtp://127.0.0.1:10025", sample);
        await new Promise<void>(done => server.stop(done));

        assertEquals(await result, sample);

        await delay(1000);
    }
});