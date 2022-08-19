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
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
