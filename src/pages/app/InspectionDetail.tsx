import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useInspection } from '@/hooks/useInspections'
import { Header } from '@/components/layout/header'
import { InspectionForm } from '@/components/inspection/InspectionForm'
import { SignatureModal } from '@/components/inspection/SignatureModal'
import { PDFGenerator } from '@/components/pdf/PDFGenerator'
import { Button } from '@/components/ui/button'
import { HeroButton } from '@/components/ui/hero-button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, PenTool, Share2, FileText, Users } from 'lucide-react'

export default function InspectionDetail() {
  const { id } = useParams<{ id: string }>()
  const { inspection, loading } = useInspection(id!)
  const [signatureModalOpen, setSignatureModalOpen] = useState(false)
  const [signatureRole, setSignatureRole] = useState<'inspector' | 'client'>('inspector')

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!inspection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vistoria não encontrada</h1>
            <Link to="/app">
              <Button>Voltar ao Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hasInspectorSignature = inspection.signatures?.some((s: any) => s.role === 'inspector')
  const hasClientSignature = inspection.signatures?.some((s: any) => s.role === 'client')
  const canGeneratePDF = hasInspectorSignature && hasClientSignature

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/app">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {inspection.title || inspection.template?.name}
              </h1>
              <p className="text-muted-foreground">
                {inspection.number} • {inspection.context_json?.client || 'Cliente não informado'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={
                inspection.status === 'signed' ? 'default' :
                inspection.status === 'awaiting_sign' ? 'secondary' :
                'outline'
              }>
                {getStatusLabel(inspection.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <Card className="shadow-soft mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Assinaturas:</span>
                  {hasInspectorSignature ? (
                    <Badge variant="default" className="bg-success text-white">Inspetor ✓</Badge>
                  ) : (
                    <Badge variant="outline">Inspetor</Badge>
                  )}
                  {hasClientSignature ? (
                    <Badge variant="default" className="bg-success text-white">Cliente ✓</Badge>
                  ) : (
                    <Badge variant="outline">Cliente</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!hasInspectorSignature && (
                  <HeroButton 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      setSignatureRole('inspector')
                      setSignatureModalOpen(true)
                    }}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Assinar como Inspetor
                  </HeroButton>
                )}

                {!hasClientSignature && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSignatureRole('client')
                      setSignatureModalOpen(true)
                    }}
                  >
                    <PenTool className="mr-2 h-4 w-4" />
                    Assinar como Cliente
                  </Button>
                )}

                {canGeneratePDF && (
                  <PDFGenerator 
                    inspection={inspection}
                    onPDFGenerated={() => {
                      // Refresh inspection data
                      window.location.reload()
                    }}
                  />
                )}

                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Form */}
        <InspectionForm inspectionId={inspection.id} />

        {/* Signature Modal */}
        <SignatureModal
          open={signatureModalOpen}
          onOpenChange={setSignatureModalOpen}
          inspectionId={inspection.id}
          role={signatureRole}
          onSignatureComplete={() => {
            // Refresh inspection data
            window.location.reload()
          }}
        />
      </main>
    </div>
  )
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'draft': return 'Rascunho'
    case 'awaiting_sign': return 'Aguardando Assinatura'
    case 'signed': return 'Assinada'
    case 'archived': return 'Arquivada'
    default: return status
  }
}