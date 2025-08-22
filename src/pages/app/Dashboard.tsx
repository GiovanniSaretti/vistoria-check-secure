import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ClipboardCheck, 
  FileText, 
  Users, 
  AlertTriangle,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, organization } = useAuth()

  const stats = [
    {
      title: "Vistorias Realizadas",
      value: "0",
      description: "Neste mês",
      icon: ClipboardCheck,
      trend: "+0%"
    },
    {
      title: "Aguardando Assinatura",
      value: "0",
      description: "Pendentes",
      icon: Clock,
      trend: "0"
    },
    {
      title: "Com Pendências",
      value: "0",
      description: "Requer atenção",
      icon: AlertTriangle,
      trend: "0"
    },
    {
      title: "Templates Ativos",
      value: "0",
      description: "Disponíveis",
      icon: FileText,
      trend: "0"
    }
  ]

  const quickActions = [
    {
      title: "Nova Vistoria",
      description: "Iniciar uma nova vistoria",
      icon: Plus,
      href: "/app/inspections/new",
      color: "bg-primary text-primary-foreground"
    },
    {
      title: "Criar Template",
      description: "Novo template personalizado",
      icon: FileText,
      href: "/app/templates/new",
      color: "bg-secondary text-secondary-foreground"
    },
    {
      title: "Gerenciar Equipe",
      description: "Adicionar usuários",
      icon: Users,
      href: "/app/settings/team",
      color: "bg-muted text-muted-foreground"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          Bem-vindo, {user?.profile?.name || user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground mt-2">
          {organization ? `Organização: ${organization.name}` : 'Configurando sua organização...'}
        </p>
        {organization && (
          <Badge variant="secondary" className="mt-2">
            Plano {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}
          </Badge>
        )}
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Inicie uma nova tarefa rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} to={action.href}>
                  <div className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-md ${action.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade recente</p>
              <p className="text-sm mt-2">
                Comece criando uma nova vistoria
              </p>
              <Link to="/app/inspections/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Vistoria
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
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
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Conta criada com sucesso</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
              <span className="text-muted-foreground">Criar primeiro template</span>
              <Link to="/app/templates">
                <Button variant="outline" size="sm">
                  Ir para Templates
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
              <span className="text-muted-foreground">Realizar primeira vistoria</span>
              <Link to="/app/inspections/new">
                <Button variant="outline" size="sm">
                  Nova Vistoria
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}