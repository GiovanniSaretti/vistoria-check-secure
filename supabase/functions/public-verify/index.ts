import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req)=>{
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const s = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const { data: link } = await s.from('public_links').select('*').eq('token', token).single()
  if (!link || link.is_revoked || new Date(link.expires_at) < new Date()){
    return Response.json({ status:'expired' },{ status:200 })
  }

  // Carregar hash salvo e gerar Signed URL do PDF
  const { data: pdf } = await s.from('pdfs').select('*').eq('inspection_id', link.inspection_id).order('generated_at', { ascending:false }).limit(1).single()
  if (!pdf) return Response.json({ status:'error' },{ status:200 })

  // (Opcional: recalcular hash a partir do JSON canônico aqui)
  const { data: signed } = await s.storage.from('pdfs').createSignedUrl(new URL(pdf.file_url).pathname.replace(/^\/storage\/v1\/object\/public\//,''), 600)
  return Response.json({ status:'verified', signedUrl: signed?.signedUrl ?? null },{ status:200 })
})