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
import { createClient } from "https://esm.sh/@supabase/supabase-js@1.33.1";

serve(async (req: Request) => {
    // check if request header "function-secret"'s content matches the one in the environment
    const functionSecret = Deno.env.get('FUNCTION_SECRET');
    const requestSecret = req.headers.get('function-secret');
    if (functionSecret !== requestSecret) {
      return new Response('Unauthorized: Wrong function-secret header!', { status: 401 });
    }

    // read entry from `notifications` table (automatically added to request by database hook)
    const { record } = await req.json();
    const { user_id: uid, content, subject } = record;
    
    // create supabase client to read user email
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: user, error } = await supabase.auth.api.getUserById(uid);
    if (error != null) {
      return new Response(error.message, { status: 500});
    } else if (!user?.email) {
      return new Response('User\'s email not found', { status: 404});
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
      to: user.email,
      subject,
      content,
    });
    await client.close();

    // return response
    return new Response(
      JSON.stringify({ done: true }),
      { headers: { 'Content-Type': 'application/json' }}
    );
});
