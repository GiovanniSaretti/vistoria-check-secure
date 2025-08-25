import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Mode='login'|'signup'
const mapErr=(e:any)=> e?.code==='invalid_credentials'?'Email ou senha inválidos.':(e?.message||'Erro.')

export default function AuthForm(){
  const [mode,setMode]=useState<Mode>('login')
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null)

  async function onSubmit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError(null)
    try{
      if(mode==='login'){
        const { error } = await supabase.auth.signInWithPassword({ email:email.trim(), password })
        if(error) throw error
      }else{
        const { error } = await supabase.auth.signUp({
          email: email.trim(), password,
          options:{ emailRedirectTo: import.meta.env.VITE_APP_URL }
        })
        if(error) throw error
      }
      window.location.href='/app'
    }catch(e:any){ setError(mapErr(e)) } finally{ setLoading(false) }
  }

  async function onForgot(){
    setLoading(true); setError(null)
    try{
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(),{
        redirectTo: import.meta.env.VITE_APP_URL + '/reset'
      })
      if(error) throw error
      alert('Enviamos um e-mail para redefinição de senha.')
    }catch(e:any){ setError(mapErr(e)) } finally{ setLoading(false) }
  }

  async function onGoogle(){
    setLoading(true); setError(null)
    try{
      const { error } = await supabase.auth.signInWithOAuth({
        provider:'google', options:{ redirectTo: import.meta.env.VITE_APP_URL }
      })
      if(error) throw error
    }catch(e:any){ setError(mapErr(e)) } finally{ setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border p-6">
      <div className="flex gap-2 mb-4">
        <button onClick={()=>setMode('login')}
          className={`px-3 py-1 rounded ${mode==='login'?'bg-primary text-primary-foreground':'bg-secondary'}`}>
          Entrar
        </button>
        <button onClick={()=>setMode('signup')}
          className={`px-3 py-1 rounded ${mode==='signup'?'bg-primary text-primary-foreground':'bg-secondary'}`}>
          Criar conta
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2 bg-background" type="email"
          placeholder="email@exemplo.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="w-full border rounded px-3 py-2 bg-background" type="password"
          placeholder="******" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button type="submit" disabled={loading}
          className="w-full h-10 rounded bg-primary text-primary-foreground">
          {loading ? 'Aguarde...' : (mode==='login'?'Entrar':'Criar conta')}
        </button>
      </form>

      <div className="mt-3 flex justify-between text-sm">
        <button onClick={onForgot} className="underline">Esqueci minha senha</button>
        <button onClick={onGoogle} className="underline">Entrar com Google</button>
      </div>
    </div>
  )
}