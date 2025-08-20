import { useAuth } from '@/hooks/useAuth'
import { useInspections } from '@/hooks/useInspections'
import { useTemplates } from '@/hooks/useTemplates'
import { Header } from '@/components/layout/header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentInspections } from '@/components/dashboard/recent-inspections'
import { ActivityFeed } from '@/components/dashboard/activity-feed'

export default function Dashboard() {
  const { user, organization } = useAuth()
  const { inspections } = useInspections()
  const { templates } = useTemplates()

  const stats = {
    totalInspections: inspections.length,
    awaitingSignature: inspections.filter(i => i.status === 'awaiting_sign').length,
    withPendencies: inspections.filter(i => 
      Object.values(i.data_json || {}).includes('pending')
    ).length,
    completed: inspections.filter(i => i.status === 'signed').length
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo, {user?.profile?.name || 'Usuário'}!
          </h1>
          <p className="text-muted-foreground">
            {organization?.name} • Plano {organization?.plan === 'payg' ? 'Pay-per-Use' : 'Ilimitado'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vistorias no Mês</p>
                <p className="text-2xl font-bold">{stats.totalInspections}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aguardando Assinatura</p>
                <p className="text-2xl font-bold">{stats.awaitingSignature}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center">
                <span className="text-warning text-sm">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Com Pendências</p>
                <p className="text-2xl font-bold">{stats.withPendencies}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <span className="text-destructive text-sm">⚠️</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success text-sm">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentInspections />
          </div>
          <div className="lg:col-span-1">
            <ActivityFeed />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t pt-8 mt-16">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>© 2024 Vistoria Check</span>
              <span>•</span>
              <span>Vistorias profissionais com verificação pública</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Plano: {organization?.plan === 'payg' ? 'Pay-per-Use' : 'Ilimitado'}</span>
              {organization?.plan === 'payg' && (
                <>
                  <span>•</span>
                  <span>PDFs utilizados: {inspections.filter(i => i.pdfs?.length > 0).length}/3</span>
                </>
              )}
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}