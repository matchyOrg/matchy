// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
const client = new SmtpClient();
const { hostname, port, username, password } = Deno.env.toObject();

await client.connect({
  hostname,
  port: Number(port),
  username,
  password,
});

serve(async (_req) => {
  await client.send({
    from: "admin@acme.com",
    to: "user@gmail.com",
    subject: "Thank you for signing up",
    content: "We sell the best roadrunner traps in the world!",
  });

  return new Response("Email sent", { status: 200 });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer <ANON KEY>' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"<YOUR NAME>"}'
