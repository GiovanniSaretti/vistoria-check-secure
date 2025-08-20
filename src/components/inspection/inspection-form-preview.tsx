import { useState } from "react"
import { CheckCircle, AlertTriangle, MinusCircle, Camera, FileText, PenTool } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeroButton } from "@/components/ui/hero-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

const mockTemplate = {
  name: "Imóvel - Entrega de Chaves",
  sections: [
    {
      title: "Sala",
      items: [
        { key: "pintura", label: "Pintura", status: "ok", requirePhoto: false },
        { key: "janelas", label: "Janelas", status: "pending", requirePhoto: true, notes: "Vidro trincado na janela lateral" },
        { key: "piso", label: "Piso", status: "ok", requirePhoto: false },
        { key: "observacoes", label: "Observações", status: null, requirePhoto: false }
      ]
    },
    {
      title: "Cozinha", 
      items: [
        { key: "bancadas", label: "Bancadas", status: "ok", requirePhoto: false },
        { key: "torneiras", label: "Torneiras", status: "na", requirePhoto: true },
        { key: "azulejos", label: "Azulejos", status: "pending", requirePhoto: false, notes: "Rejunte escuro próximo ao fogão" }
      ]
    }
  ]
}

type ItemStatus = "ok" | "pending" | "na" | null

export function InspectionFormPreview() {
  const [selectedSection, setSelectedSection] = useState(0)
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>({
    pintura: "ok",
    janelas: "pending", 
    piso: "ok",
    bancadas: "ok",
    torneiras: "na",
    azulejos: "pending"
  })

  const handleStatusChange = (itemKey: string, status: ItemStatus) => {
    setItemStatuses(prev => ({ ...prev, [itemKey]: status }))
  }

  const currentSection = mockTemplate.sections[selectedSection]
  const completedItems = Object.values(itemStatuses).filter(status => status !== null).length
  const totalItems = mockTemplate.sections.reduce((total, section) => total + section.items.length, 0)

  return (
    <Card className="shadow-medium max-w-4xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {mockTemplate.name}
            </CardTitle>
            <CardDescription>
              VST-005 • Cliente: Maria Santos • Apartamento 401 - Ed. Vista Mar
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {completedItems}/{totalItems} itens
            </Badge>
            <HeroButton variant="hero" size="sm">
              <PenTool className="mr-2 h-4 w-4" />
              Assinar
            </HeroButton>
          </div>
        </div>
      </CardHeader>

      <div className="flex min-h-[500px]">
        {/* Sidebar - Seções */}
        <div className="w-64 border-r bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Seções
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {mockTemplate.sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setSelectedSection(index)}
                className={`w-full text-left p-3 rounded-lg transition-smooth ${
                  selectedSection === index 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="font-medium">{section.title}</div>
                <div className="text-xs opacity-75 mt-1">
                  {section.items.length} itens
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Itens da Seção */}
        <div className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{currentSection.title}</h2>
              <Badge variant="secondary">
                {currentSection.items.length} itens
              </Badge>
            </div>

            <div className="space-y-4">
              {currentSection.items.map((item) => (
                <div key={item.key} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{item.label}</h4>
                      {item.requirePhoto && (
                        <Badge variant="outline" className="text-xs">
                          <Camera className="mr-1 h-3 w-3" />
                          Foto obrigatória
                        </Badge>
                      )}
                    </div>
                    {itemStatuses[item.key] && (
                      <StatusBadge status={itemStatuses[item.key]!} size="sm" />
                    )}
                  </div>

                  {/* Status Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant={itemStatuses[item.key] === "ok" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.key, "ok")}
                      className={itemStatuses[item.key] === "ok" ? "bg-success hover:bg-success/90 text-white" : ""}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      OK
                    </Button>
                    <Button
                      variant={itemStatuses[item.key] === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.key, "pending")}
                      className={itemStatuses[item.key] === "pending" ? "bg-warning hover:bg-warning/90 text-white" : ""}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Pendência
                    </Button>
                    <Button
                      variant={itemStatuses[item.key] === "na" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(item.key, "na")}
                      className={itemStatuses[item.key] === "na" ? "bg-muted hover:bg-muted/90" : ""}
                    >
                      <MinusCircle className="mr-2 h-4 w-4" />
                      N/A
                    </Button>
                  </div>

                  {/* Notes para itens com pendência */}
                  {itemStatuses[item.key] === "pending" && (
                    <div className="space-y-2 pt-2 border-t">
                      <label className="text-sm font-medium text-muted-foreground">
                        Observações da pendência:
                      </label>
                      <Textarea 
                        placeholder="Descreva o problema encontrado..."
                        className="min-h-[60px]"
                        defaultValue={item.notes || ""}
                      />
                    </div>
                  )}

                  {/* Photo Upload Area */}
                  {item.requirePhoto && (
                    <div className="pt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Adicionar Foto
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}