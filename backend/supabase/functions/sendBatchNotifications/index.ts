import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { SmtpClient } from "https://deno.land/x/denomailer@0.12.0/mod.ts";

interface Notification {
    id: number;
    email: string;
    content: string;
    subject: string;
}

const chunk = (arr: Notification[]) => {
    const ret = [];
    const chunkSize = 10; // aws email per second max
    let start = 0; 
    let end = chunkSize; 
    while (start < arr.length) {
        ret.push(arr.slice(start, end));
        start = end;
        end += chunkSize;
    }
    return ret;
}

serve(async (req: Request) => {
    const functionSecret = Deno.env.get('FUNCTION_SECRET');
    const requestSecret = req.headers.get('function-secret');

    if (functionSecret !== requestSecret) {
        return new Response('Unauthorized: Wrong function-secret header!', { status: 401 });
    }

    const notifications = await req.json();
    const partitionedNotifications = chunk(notifications);

    const client = new SmtpClient();

    await client.connect({
        hostname: Deno.env.get('SMTP_HOSTNAME')!,
        port: Number(Deno.env.get('SMTP_PORT')!),
        username: Deno.env.get('SMTP_USERNAME')!,
        password: Deno.env.get('SMTP_PASSWORD')!,
    });

    partitionedNotifications.forEach(async (partition) => {
        const sendPromises = partition.map(({ email, subject, content }) => {
            client.send({
                from: Deno.env.get('SMTP_FROM')!,
                to: email,
                subject,
                content,
            });
        });
        await Promise.all(sendPromises);
        await new Promise((resolve) => setTimeout(resolve, 1500)); // sleep for a second
    });

    return new Response("done", { status: 200 });

});