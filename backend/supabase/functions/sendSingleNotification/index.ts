/**
 * Configure your editor for deno:
 * - https://deno.land/manual/getting_started/setup_your_environment
 * 
 * See these tutorials for better understanding of this function:
 * - https://youtu.be/ZhlXnWRts04?t=3692
 * - https://github.com/supabase-community/partner-gallery-example
 */

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@0.12.0/mod.ts";

serve(async (req: Request) => {
    // check if request header "function-secret"'s content matches the one in the environment
    const functionSecret = Deno.env.get('FUNCTION_SECRET');
    const requestSecret = req.headers.get('function-secret');
    if (functionSecret !== requestSecret) {
      return new Response('Unauthorized: Wrong function-secret header!', { status: 401 });
    }

    // read entry from `notifications` table (automatically added to request by database hook)
    const { record } = await req.json();
    const { email, content, subject, send_earliest_at: sendEarliestAt } = record;
    
    // scheduled messages are handled by sendBatchNotifications invoked by cron-job
    if (sendEarliestAt !== null) {
      return new Response('Scheduled message', { status: 204 });
    }
    
    // connect to SMTP server
    const client = new SmtpClient();
    await client.connect({
      hostname: Deno.env.get('SMTP_HOSTNAME')!,
      port: Number(Deno.env.get('SMTP_PORT')!),
      username: Deno.env.get('SMTP_USERNAME')!,
      password: Deno.env.get('SMTP_PASSWORD')!,
    });

    // send mail
    await client.send({
      from: Deno.env.get('SMTP_FROM')!,
      to: email,
      subject,
      content,
    });
    await client.close();

    // return response
    return new Response("done", { status: 200 });
});
