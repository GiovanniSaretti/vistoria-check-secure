import { Plus, FileText, Copy, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButton } from "@/components/ui/hero-button"
import { Button } from "@/components/ui/button"

const templates = [
  {
    id: 1,
    name: "Imóvel - Entrega de Chaves",
    description: "Template completo para vistoria de imóveis",
    itemCount: 45,
    lastUsed: "2 dias atrás"
  },
  {
    id: 2,
    name: "Veículo - Check Geral",
    description: "Vistoria de veículos para frotas",
    itemCount: 32,
    lastUsed: "1 semana atrás"
  },
  {
    id: 3,
    name: "Equipamento Industrial",
    description: "Inspeção de equipamentos e maquinário",
    itemCount: 28,
    lastUsed: "3 dias atrás"
  }
]

export function QuickActions() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Nova Vistoria */}
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Nova Vistoria
          </CardTitle>
          <CardDescription>
            Escolha um template e inicie uma nova vistoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {templates.map((template) => (
            <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-smooth">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{template.name}</h4>
                <p className="text-sm text-muted-foreground">{template.itemCount} itens • {template.lastUsed}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <HeroButton variant="primary" size="sm">
                  Usar
                </HeroButton>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t">
            <Button variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Gerenciar Templates
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso direto às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <HeroButton variant="hero" size="lg" className="w-full justify-start">
            <Plus className="mr-2 h-5 w-5" />
            Criar Novo Template
          </HeroButton>
          
          <Button variant="outline" size="lg" className="w-full justify-start" asChild>
            <Link to="/inspection-demo">
              <FileText className="mr-2 h-5 w-5" />
              Ver Demo de Vistoria
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="w-full justify-start">
            <Share2 className="mr-2 h-5 w-5" />
            Links Públicos
          </Button>
          
          <div className="pt-3 space-y-2 border-t">
            <p className="text-sm font-medium">Plano Atual: Pay-per-Use</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>PDFs gerados: 2/3 gratuitos</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                Ver planos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}