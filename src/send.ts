import * as amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }
        const queue = "hello";
        const msg = {
            email: "piono623@naver.com",
            url: "http://localhost:8000/user/verify?code=accdc868-9060-4c52-90b1-489b10ef0dfe"
        };
        channel.assertQueue(queue, {
            durable: false,
        });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(` [x] Sent ${JSON.stringify(msg)}`);
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    });
});
