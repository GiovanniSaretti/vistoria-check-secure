import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function ResetPassword(){
  const [password,setPassword]=useState(''); const [msg,setMsg]=useState('')
  async function onSubmit(e:React.FormEvent){ e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    setMsg(error? error.message : 'Senha atualizada. Faça login.')
  }
  return (
    <div className="min-h-dvh grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border p-6 space-y-3">
        <h1 className="text-xl font-semibold">Definir nova senha</h1>
        <input className="w-full border rounded px-3 py-2" type="password"
          placeholder="Nova senha" value={password} onChange={e=>setPassword(e.target.value)} required/>
        <button className="h-10 w-full rounded bg-primary text-primary-foreground">Salvar</button>
        {msg && <p className="text-sm mt-2">{msg}</p>}
      </form>
    </div>
  )
}