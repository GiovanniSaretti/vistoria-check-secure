import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

function tok(n=32){
  return crypto.getRandomValues(new Uint8Array(n)).reduce((a,b)=>a+b.toString(16).padStart(2,'0'),"")
}

Deno.serve(async (req)=>{
  const { inspection_id, mode='verify', expires_days=30 } = await req.json()
  const s = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const expires_at = new Date(Date.now()+expires_days*864e5).toISOString()
  const { data, error } = await s.from('public_links').insert({ 
    inspection_id, 
    token: tok(), 
    type: mode, 
    expires_at 
  }).select().single()
  
  if (error) return new Response(error.message,{status:400})
  
  return Response.json({ 
    token: data.token, 
    url: `${Deno.env.get('APP_URL')}/p/${data.token}`, 
    expires_at 
  })
})