import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useSession(){
  const [session, setSession] = useState<Session|null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    let mounted = true
    supabase.auth.getSession().then(({data})=>{
      if(!mounted) return
      setSession(data.session ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s)=>{
      if(!mounted) return
      setSession(s)
      setLoading(false)
    })
    return () => { mounted = false; subscription.unsubscribe() }
  },[])
  return { session, loading }
}