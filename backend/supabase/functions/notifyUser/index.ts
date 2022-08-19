/**
 * Configure your editor for dino:
 * - https://deno.land/manual/getting_started/setup_your_environment
 * 
 * See these tutorials for better understanding of this function:
 * - https://youtu.be/ZhlXnWRts04?t=3692
 * - https://github.com/supabase-community/partner-gallery-example
 */

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/denomailer@0.12.0/mod.ts'

const client = new SmtpClient()

serve(async (req) => {
  try {
    // connect to SMTP server
    await client.connect({
      hostname: Deno.env.get('SMTP_HOSTNAME')!,
      port: Number(Deno.env.get('SMTP_PORT')!),
      username: Deno.env.get('SMTP_USERNAME')!,
      password: Deno.env.get('SMTP_PASSWORD')!,
    })

    // check if request header "function-secret"'s content matches the one in the environment
    const functionSecret = Deno.env.get('FUNCTION_SECRET')
    const requestSecret = req.headers.get('function-secret')
    if (functionSecret !== requestSecret) {
      return new Response('Unauthorized: Wrong function-secret header!', { status: 401 })
    }
      
    // const body = await req.json()
    // const { record } = body
    // const content = Object.entries(record).reduce(
    //   (acc, [key, value]) => acc + `${key}: ${value || 'NOT_PROVIDED'}\n`,
    //   ''
    // )

    await client.send({
      from: Deno.env.get('SMTP_FROM')!,
      to: Deno.env.get('SMTP_TO')!,
      subject: `Notification`,
      content: `Yo heres a notification!`,
    })

    await client.close()

  } catch (error: any) {
    return new Response(error, { status: 500 })
  }

  return new Response(
    JSON.stringify({
      done: true,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
})
