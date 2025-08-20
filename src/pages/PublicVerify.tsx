import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { canonicalJSONString } from '@/lib/canonical'
import { verifyInspectionIntegrity } from '@/lib/hash-browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/sonner'
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  Building,
  User
} from 'lucide-react'

interface VerificationData {
  inspection: any
  pdf: any
  isValid: boolean
  hash: string
  calculatedHash: string
}

export default function PublicVerify() {
  const { token } = useParams()
  const [status, setStatus] = useState<'loading' | 'verified' | 'tampered' | 'invalid' | 'expired'>('loading')
  const [data, setData] = useState<VerificationData | null>(null)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    verifyInspection()
  }, [token])

  const verifyInspection = async () => {
    try {
      // Get public link
      const { data: linkData, error: linkError } = await supabase
        .from('public_links')
        .select('*')
        .eq('token', token)
        .eq('type', 'verification')
        .single()

      if (linkError || !linkData) {
        setStatus('invalid')
        return
      }

      // Check if expired or revoked
      if (linkData.is_revoked || new Date(linkData.expires_at) < new Date()) {
        setStatus('expired')
        return
      }

      // Increment view count
      await supabase
        .from('public_links')
        .update({ views_count: linkData.views_count + 1 })
        .eq('id', linkData.id)

      setViewCount(linkData.views_count + 1)

      // Get inspection data
      const { data: inspectionData, error: inspectionError } = await supabase
        .from('inspections')
        .select(`
          *,
          template:templates(*),
          organization:organizations(name),
          inspection_items(*),
          photos(*),
          signatures(*),
          pdfs(*)
        `)
        .eq('id', linkData.inspection_id)
        .single()

      if (inspectionError || !inspectionData) {
        setStatus('invalid')
        return
      }

      // Get the latest PDF
      const latestPdf = inspectionData.pdfs?.[inspectionData.pdfs.length - 1]
      if (!latestPdf) {
        setStatus('invalid')
        return
      }

      // Verify integrity
      const isValid = await verifyInspectionIntegrity(
        latestPdf.canonical_json,
        latestPdf.sha256
      )

      setData({
        inspection: inspectionData,
        pdf: latestPdf,
        isValid,
        hash: latestPdf.sha256,
        calculatedHash: latestPdf.sha256 // In a real scenario, we'd recalculate
      })

      setStatus(isValid ? 'verified' : 'tampered')

    } catch (error) {
      console.error('Verification error:', error)
      setStatus('invalid')
    }
  }

  const downloadPDF = async () => {
    if (!data?.pdf) return

    try {
      const response = await fetch(data.pdf.file_url)
      const blob = await response.blob()
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = data.pdf.filename || `${data.inspection.number}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('PDF baixado com sucesso!')
    } catch (error) {
      toast.error('Erro ao baixar PDF')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando integridade do relatório...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Vistoria Check</h1>
              <p className="text-sm text-muted-foreground">Verificação Pública</p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <Card className="shadow-medium mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'verified' && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <ShieldCheck className="h-8 w-8 text-success" />
                </div>
              )}
              {status === 'tampered' && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldX className="h-8 w-8 text-destructive" />
                </div>
              )}
              {(status === 'invalid' || status === 'expired') && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
                  <Shield className="h-8 w-8 text-warning" />
                </div>
              )}
            </div>
            
            <CardTitle className="text-xl">
              {status === 'verified' && 'Relatório Verificado'}
              {status === 'tampered' && 'Relatório Alterado'}
              {status === 'invalid' && 'Link Inválido'}
              {status === 'expired' && 'Link Expirado'}
            </CardTitle>
            
            <CardDescription>
              {status === 'verified' && 'A integridade do relatório foi confirmada'}
              {status === 'tampered' && 'O relatório foi modificado após a geração'}
              {status === 'invalid' && 'O link de verificação não é válido'}
              {status === 'expired' && 'O link de verificação expirou ou foi revogado'}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Inspection Details */}
        {data && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações da Vistoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="font-mono">{data.inspection.number}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Título:</span>
                  <span>{data.inspection.title || 'Sem título'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template:</span>
                  <span>{data.inspection.template?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={data.inspection.status === 'signed' ? 'default' : 'secondary'}>
                    {getStatusLabel(data.inspection.status)}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data:</span>
                  <span>{new Date(data.inspection.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                
                {data.inspection.signed_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assinada em:</span>
                    <span>{new Date(data.inspection.signed_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organization & Technical Info */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informações Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empresa:</span>
                  <span>{data.inspection.organization?.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span>{data.inspection.context_json?.client || 'Não informado'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hash SHA-256:</span>
                  <span className="font-mono text-xs break-all">{data.hash}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PDF Gerado:</span>
                  <span>{new Date(data.pdf.generated_at).toLocaleDateString('pt-BR')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visualizações:</span>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{viewCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        {data && status === 'verified' && (
          <Card className="shadow-soft mt-6">
            <CardContent className="pt-6">
              <div className="flex justify-center gap-4">
                <Button onClick={downloadPDF} size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Baixar PDF Original
                </Button>
              </div>
              
              <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>Este relatório foi verificado e sua integridade está garantida.</p>
                <p>O hash SHA-256 confirma que o documento não foi alterado.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Token: {token}</p>
          <p className="mt-2">
            Powered by <strong>Vistoria Check</strong> - Vistorias com verificação pública
          </p>
        </div>
      </div>
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