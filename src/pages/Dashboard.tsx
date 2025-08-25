import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useSession } from '@/hooks/useSession'
import { Link } from 'react-router-dom'

type Metric = { inspectionsMonth: number; pendingPct: number; avgSignHrs: number; linksExpiring: number }

export default function Dashboard(){
  const { session, loading: authLoading } = useSession()
  const [m,setM]=useState<Metric|null>(null); const [loading,setLoading]=useState(true)

  useEffect(()=>{ 
    if (!session) return
    (async ()=>{
      // Exemplo simples (ajuste para seus esquemas reais):
      // Vistorias do mês
      const start = new Date(); start.setDate(1); start.setHours(0,0,0,0)
      const { data: insp } = await supabase
        .from('inspections').select('id,status,created_at')
        .gte('created_at', start.toISOString())

      const inspectionsMonth = insp?.length ?? 0
      const pend = insp?.filter(i=>i.status==='awaiting_sign')?.length ?? 0
      const pendingPct = inspectionsMonth? Math.round((pend/inspectionsMonth)*100) : 0
      // (placeholder) tempo médio até assinatura
      const avgSignHrs = 12
      // Links expirando em 7 dias
      const now = new Date(); const soon = new Date(Date.now()+7*864e5)
      const { data: links } = await supabase
        .from('public_links').select('id,expires_at,is_revoked')
        .gte('expires_at', now.toISOString()).lte('expires_at', soon.toISOString())
        .eq('is_revoked', false)

      setM({ inspectionsMonth, pendingPct, avgSignHrs, linksExpiring: links?.length ?? 0 })
      setLoading(false)
  })() },[session])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    window.location.href = '/auth'
    return null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link className="rounded bg-primary text-primary-foreground px-4 py-2" to="/app/inspections/new">
          Nova Vistoria
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {loading ? (
          <>
            <div className="h-24 rounded border animate-pulse" />
            <div className="h-24 rounded border animate-pulse" />
            <div className="h-24 rounded border animate-pulse" />
            <div className="h-24 rounded border animate-pulse" />
          </>
        ) : (
          <>
            <Card title="Vistorias no mês" value={m?.inspectionsMonth ?? 0}/>
            <Card title="% Aguardando assinatura" value={`${m?.pendingPct ?? 0}%`}/>
            <Card title="Tempo médio até assinatura" value={`${m?.avgSignHrs ?? 0}h`}/>
            <Card title="Links a expirar (7d)" value={m?.linksExpiring ?? 0}/>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction to="/app/inspections" label="Vistorias"/>
        <QuickAction to="/app/templates" label="Templates"/>
        <QuickAction to="/app/billing" label="Billing/Plano"/>
        <QuickAction to="/app/settings" label="Configurações"/>
      </div>
    </div>
  )
}

function Card({title,value}:{title:string;value:React.ReactNode}){
  return <div className="rounded-xl border p-4 shadow-soft bg-card">
    <div className="text-sm text-muted-foreground">{title}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
}

function QuickAction({to,label}:{to:string;label:string}){
  return <Link to={to} className="rounded-xl border p-4 hover:shadow-medium transition-smooth block">
    <div className="text-lg font-medium">{label}</div>
    <div className="text-sm text-muted-foreground">Acessar {label}</div>
  </Link>
}