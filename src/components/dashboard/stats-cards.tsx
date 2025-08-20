import { 
  ClipboardCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const statsData = [
  {
    title: "Vistorias no Mês",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: ClipboardCheck,
    description: "vs. mês anterior"
  },
  {
    title: "Aguardando Assinatura", 
    value: "8",
    change: "3 urgentes",
    changeType: "warning" as const,
    icon: Clock,
    description: "pendentes hoje"
  },
  {
    title: "Com Pendências",
    value: "15%",
    change: "-5%",
    changeType: "positive" as const,
    icon: AlertTriangle,
    description: "taxa mensal"
  },
  {
    title: "Concluídas",
    value: "16",
    change: "+8",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "esta semana"
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs">
              <span
                className={`flex items-center gap-1 ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "warning"
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              >
                {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}