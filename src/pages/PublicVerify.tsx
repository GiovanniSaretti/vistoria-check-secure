import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

type VerifyResp = { status:'verified'|'tampered'|'expired'|'error', signedUrl?:string }

export default function PublicVerify(){
  const { token } = useParams()
  const [state,setState]=useState<VerifyResp>({ status:'error' })

  useEffect(()=>{
    (async ()=>{
      try{
        const r = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-verify?token=${token}`)
        const data = await r.json()
        setState(r.ok ? data : { status:'error' })
      }catch{ setState({ status:'error' }) }
    })()
  },[token])

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Verificação do Relatório</h1>
      {state.status==='verified' && <p className="text-green-600">VERIFICADO</p>}
      {state.status==='tampered' && <p className="text-red-600">ALTERADO</p>}
      {state.status==='expired' && <p className="text-orange-600">EXPIRADO / REVOGADO</p>}
      {state.status==='error' && <p className="text-rose-600">Erro ao verificar</p>}
      {state.signedUrl && <a className="mt-4 inline-block underline" href={state.signedUrl}>Baixar PDF</a>}
    </div>
  )
}