import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

function tok(n=32){return crypto.getRandomValues(new Uint8Array(n)).reduce((a,b)=>a+b.toString(16).padStart(2,'0'),"")}
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { inspection_id, mode='verify', expires_days=30 } = await req.json()
    const s = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const expires_at = new Date(Date.now() + expires_days*864e5).toISOString()

    const { data, error } = await s.from('public_links')
      .insert({ inspection_id, token: tok(), mode, expires_at })
      .select().single()

    if (error) return new Response(error.message, { status: 400, headers: cors })

    return new Response(JSON.stringify({
      token: data.token,
      url: `${Deno.env.get('APP_URL')}/p/${data.token}`,
      expires_at
    }), { headers: { ...cors, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(String(e?.message ?? e), { status: 400, headers: cors })
  }
})
