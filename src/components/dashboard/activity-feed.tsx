import { CheckCircle, FileText, Share2, AlertTriangle, UserPlus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    type: "pdf_generated",
    title: "PDF gerado",
    description: "VST-001 - Apartamento 305",
    timestamp: "2 horas atrás",
    icon: FileText,
    variant: "success" as const
  },
  {
    id: 2,
    type: "inspection_signed",
    title: "Vistoria assinada",
    description: "VST-004 - Sala Comercial 201 por João Santos",
    timestamp: "4 horas atrás", 
    icon: CheckCircle,
    variant: "success" as const
  },
  {
    id: 3,
    type: "pending_items",
    title: "Pendências identificadas",
    description: "VST-002 - 3 itens com pendência",
    timestamp: "1 dia atrás",
    icon: AlertTriangle,
    variant: "warning" as const
  },
  {
    id: 4,
    type: "public_link",
    title: "Link público criado",
    description: "VST-001 - Link válido por 30 dias",
    timestamp: "1 dia atrás",
    icon: Share2,
    variant: "default" as const
  },
  {
    id: 5,
    type: "team_invite",
    title: "Novo membro adicionado",
    description: "Carlos Oliveira como Inspector",
    timestamp: "2 dias atrás",
    icon: UserPlus,
    variant: "default" as const
  }
]

const variantColors = {
  success: "text-success",
  warning: "text-warning", 
  default: "text-muted-foreground"
}

export function ActivityFeed() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>
          Últimas ações realizadas na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`rounded-full p-2 ${
                activity.variant === "success" ? "bg-success/10" :
                activity.variant === "warning" ? "bg-warning/10" :
                "bg-muted"
              }`}>
                <activity.icon className={`h-4 w-4 ${variantColors[activity.variant]}`} />
              </div>
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{activity.title}</p>
                  {activity.variant === "success" && (
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                      Novo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}