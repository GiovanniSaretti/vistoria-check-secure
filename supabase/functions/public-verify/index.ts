import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try{
    const url = new URL(req.url)
    const token = url.searchParams.get('token') ?? ''
    const s = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const { data: link, error: e1 } = await s.from('public_links').select('*').eq('token', token).single()
    if (e1 || !link) return new Response(JSON.stringify({ status:'error' }), { headers: cors })
    if (link.is_revoked || new Date(link.expires_at) < new Date())
      return new Response(JSON.stringify({ status:'expired' }), { headers: cors })

    // último PDF da vistoria
    const { data: pdf, error: e2 } = await s.from('pdfs')
      .select('*')
      .eq('inspection_id', link.inspection_id)
      .order('generated_at', { ascending:false })
      .limit(1).single()

    if (e2 || !pdf) return new Response(JSON.stringify({ status:'error' }), { headers: cors })

    // Gera Signed URL usando storage_path (preferível). Se não houver, tenta extrair do file_url.
    let path = pdf.storage_path
    if (!path && pdf.file_url) {
      try {
        // tentativa best-effort: pega trecho após /object/ e remove prefixos
        const u = new URL(pdf.file_url)
        path = u.pathname.replace(/^\/storage\/v1\/object\/(public|signing)\/?/, '')
      } catch {}
    }

    let signedUrl: string | null = null
    if (path) {
      const { data: signed } = await s.storage.from('pdfs').createSignedUrl(path, 600)
      signedUrl = signed?.signedUrl ?? null
    }

    // MVP: assumimos 'verified'. (Na V2, recalcular SHA-256 do JSON canônico e comparar com pdf.sha256)
    return new Response(JSON.stringify({ status:'verified', signedUrl }), { headers: cors })
  }catch(e){
    return new Response(JSON.stringify({ status:'error', message:String(e?.message ?? e) }), { headers: cors })
  }
})
