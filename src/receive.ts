import * as amqp from "amqplib/callback_api";
import * as nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,  // 465
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
});

amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = "hello";
        channel.assertQueue(queue, {
            durable: false,
        });
        console.log(` [*] Waiting for message in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, async function(msg) {
            const { email, url } = JSON.parse(msg.content.toString());
            console.log(` [x] Received ${email} (${url})`);
            const info = await transporter.sendMail({
                from: `"MLRD👻" <${process.env.NODEMAILER_EMAIL}>`,
                to: email,
                subject: "Hello ✔",
                html: `Click <a href="${url}">here</a> to verify.`
            });
            console.log(`Message sent: ${info.messageId}`);
            channel.ack(msg);
        }, {
            noAck: false,
        });
    });
});
