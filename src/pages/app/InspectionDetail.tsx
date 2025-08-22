import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ClipboardCheck, 
  Download, 
  Share, 
  Edit, 
  FileText,
  Camera,
  Signature,
  Eye
} from 'lucide-react'

export default function InspectionDetail() {
  const { id } = useParams()
  const [inspection] = useState(null) // Will be loaded from API

  if (!inspection) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vistoria #{id}</h1>
            <p className="text-muted-foreground">Carregando detalhes...</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <ClipboardCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Vistoria não encontrada</h3>
              <p className="text-muted-foreground">
                Esta vistoria pode não existir ou você não tem permissão para visualizá-la.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vistoria #{id}</h1>
          <p className="text-muted-foreground">Detalhes da vistoria</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Status and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações da Vistoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                <p className="font-medium">-</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data</label>
                <p className="font-medium">-</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Local</label>
                <p className="font-medium">-</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inspetor</label>
                <p className="font-medium">-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="secondary">Em Rascunho</Badge>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Preencher Formulário</h3>
                <p className="text-sm text-muted-foreground">
                  Complete os itens da vistoria
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Camera className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Adicionar Fotos</h3>
                <p className="text-sm text-muted-foreground">
                  0 fotos adicionadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-muted rounded-lg">
                <Signature className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Coletar Assinaturas</h3>
                <p className="text-sm text-muted-foreground">
                  0 de 2 assinaturas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Vistoria em desenvolvimento</h3>
            <p className="text-muted-foreground max-w-md">
              Esta página será implementada com os detalhes completos da vistoria, 
              incluindo formulário, fotos e assinaturas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}