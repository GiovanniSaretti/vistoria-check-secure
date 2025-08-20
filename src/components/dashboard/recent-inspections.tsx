import { MoreHorizontal, Download, Share2, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const recentInspections = [
  {
    id: "VST-001",
    title: "Apartamento 305 - Ed. Sunrise",
    client: "Maria Silva",
    template: "Imóvel - Entrega",
    status: "signed" as const,
    createdAt: "2024-01-15",
    signedAt: "2024-01-16",
    pendingItems: 0,
    totalItems: 45,
    hasPdf: true
  },
  {
    id: "VST-002", 
    title: "Honda Civic 2023 - ABC-1234",
    client: "João Santos",
    template: "Veículo - Check",
    status: "awaiting_sign" as const,
    createdAt: "2024-01-14",
    signedAt: null,
    pendingItems: 3,
    totalItems: 32,
    hasPdf: false
  },
  {
    id: "VST-003",
    title: "Equipamento Industrial #4521",
    client: "Indústria XYZ",
    template: "Equipamento",
    status: "draft" as const,
    createdAt: "2024-01-13",
    signedAt: null,
    pendingItems: 12,
    totalItems: 28,
    hasPdf: false
  },
  {
    id: "VST-004",
    title: "Sala Comercial 201 - Centro",
    client: "Empresa ABC",
    template: "Imóvel - Entrega",
    status: "signed" as const,
    createdAt: "2024-01-12",
    signedAt: "2024-01-12",
    pendingItems: 2,
    totalItems: 45,
    hasPdf: true
  }
]

const statusLabels = {
  draft: "Rascunho",
  awaiting_sign: "Aguardando Assinatura", 
  signed: "Assinada",
  archived: "Arquivada"
}

const statusVariants = {
  draft: "secondary" as const,
  awaiting_sign: "outline" as const,
  signed: "default" as const,
  archived: "secondary" as const
}

export function RecentInspections() {
  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vistorias Recentes</CardTitle>
            <CardDescription>
              Últimas vistorias criadas e seu status atual
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInspections.map((inspection) => (
            <div key={inspection.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {inspection.id}
                  </span>
                  <Badge variant={statusVariants[inspection.status]} className="text-xs">
                    {statusLabels[inspection.status]}
                  </Badge>
                </div>
                
                <h4 className="font-medium truncate">{inspection.title}</h4>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Cliente: {inspection.client}</span>
                  <span>•</span>
                  <span>{inspection.template}</span>
                  <span>•</span>
                  <span>{new Date(inspection.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {inspection.pendingItems > 0 ? (
                    <StatusBadge status="pending" size="sm" showLabel={false} />
                  ) : (
                    <StatusBadge status="ok" size="sm" showLabel={false} />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {inspection.pendingItems > 0 
                      ? `${inspection.pendingItems} pendências`
                      : `${inspection.totalItems} itens OK`
                    }
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {inspection.hasPdf && (
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    {inspection.hasPdf && (
                      <>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="mr-2 h-4 w-4" />
                          Compartilhar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}