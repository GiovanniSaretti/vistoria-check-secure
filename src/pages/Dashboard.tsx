import { useSession } from '@/hooks/useSession'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardCheck, 
  FileText, 
  Users, 
  AlertTriangle,
  Plus,
  LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const { session, loading } = useSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Entre na sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => supabase.auth.signInWithPassword({
                email: 'test@example.com',
                password: 'password123'
              })}
              className="w-full"
            >
              Login de Teste
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Vistorias Realizadas",
      value: "0",
      description: "Neste mês",
      icon: ClipboardCheck,
      trend: "+0%"
    },
    {
      title: "Templates Ativos",
      value: "1",
      description: "Disponíveis",
      icon: FileText,
      trend: "1"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session.user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Primeiros Passos</CardTitle>
              <CardDescription>
                Configure sua conta para começar a usar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground">Criar primeiro template</span>
                  <Button variant="outline" size="sm">
                    Ir para Templates
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                  <span className="text-muted-foreground">Realizar primeira vistoria</span>
                  <Button variant="outline" size="sm">
                    Nova Vistoria
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}