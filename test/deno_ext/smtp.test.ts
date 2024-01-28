import {assertEquals} from "../../deps.test.ts";
import {smtpSend} from "../../src/deno_ext/smtp.ts";

const cs = "";
const em = "";

Deno.test({
    ignore: true,
    name: "SMTP: Send",
    async fn(){
        await smtpSend(cs, {
            from: em,
            to: [em],
            title: "CI Test",
            body: "CI Test"
        });

        assertEquals(true, true);
    }
});