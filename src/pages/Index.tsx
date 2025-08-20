import { Header } from "@/components/layout/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentInspections } from "@/components/dashboard/recent-inspections"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Acompanhe suas vistorias e métricas em tempo real.
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

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
              <span>Plano: Pay-per-Use</span>
              <span>•</span>
              <span>2/3 PDFs utilizados</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default Index