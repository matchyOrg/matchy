// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/denomailer@0.12.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^1.35.6";
import { escapeHtml } from "https://deno.land/x/escape_html/mod.ts";

const chunk = <T>(arr: T[]): T[][] => {
  const ret: T[][] = [];
  const chunkSize = 10; // aws email per second max
  let start = 0;
  let end = chunkSize;
  while (start < arr.length) {
    ret.push(arr.slice(start, end));
    start = end;
    end += chunkSize;
  }
  return ret;
};

serve(async (req) => {
  const functionSecret = Deno.env.get("FUNCTION_SECRET");
  const requestSecret = req.headers.get("function-secret");
  if (functionSecret !== requestSecret) {
    return new Response("Unauthorized: Wrong function-secret header!", {
      status: 401,
    });
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceKey) {
    return new Response("Configuration error", { status: 500 });
  }

  const eventId = await req.text();
  console.log(eventId);

  if (!eventId) {
    return new Response("Missing event id", { status: 400 });
  }

  const supabase = createClient(url, serviceKey);
  const {
    data,
    error,
  }: {
    data: {
      title: string;
      registrations: { user: { email: string } }[];
    } | null;
    error: any;
  } = await supabase
    .from("events")
    .select("title, registrations:event_registrations(user:user_id(email))")
    .eq("id", eventId)
    .eq("registrations.present", true)
    .single();
  if (error || !data) {
    return new Response("Event could not be loaded or doesn't exist", {
      status: 400,
    });
  }
  const emails = data.registrations.map(({ user }) => user.email);
  if (emails.length === 0) {
    return new Response("No participants at event", { status: 204 });
  }
  const client = new SmtpClient();
  await client.connect({
    hostname: Deno.env.get("SMTP_HOSTNAME")!,
    port: Number(Deno.env.get("SMTP_PORT")!),
    username: Deno.env.get("SMTP_USERNAME")!,
    password: Deno.env.get("SMTP_PASSWORD")!,
  });

  const chunkedEmails = chunk(emails);
  chunkedEmails.forEach(async (chunk) => {
    const sendPromises = chunk.map((email) => {
      client.send({
        from: Deno.env.get("SMTP_FROM")!,
        to: email,
        subject: "Your matches are now available",
        html: `
              <h2>Good news!</h2>
              <h2>Your matches for the event \"<b>${escapeHtml(
                data.title
              )}</b>\" are now available</h2>
              <br>
              <div>Check them out <a href="https://matchy.at/matches">here</a>.</div>
            `,
      });
    });
    await Promise.all(sendPromises);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // sleep for a second
  });

  return new Response("done", { status: 200 });
});
