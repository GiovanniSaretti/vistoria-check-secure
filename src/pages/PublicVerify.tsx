import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Eye,
  Calendar,
  MapPin,
  User,
  Clock
} from 'lucide-react'

export default function PublicVerify() {
  const { token } = useParams()
  const [verificationData, setVerificationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulated API call - will be replaced with actual verification
    const mockVerification = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for demonstration
        setVerificationData({
          status: 'verified', // 'verified' | 'tampered' | 'expired'
          inspection: {
            number: '2024-001',
            client: 'Empresa XYZ Ltda',
            location: 'Av. Paulista, 1000 - São Paulo, SP',
            inspector: 'João Silva',
            date: '2024-08-21T10:00:00Z',
            template: 'Vistoria de Imóvel Comercial'
          },
          hash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
          generated_at: '2024-08-21T14:30:00Z',
          views: 12
        })
      } catch (err) {
        setError('Erro ao verificar documento')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      mockVerification()
    } else {
      setError('Token de verificação não fornecido')
      setLoading(false)
    }
  }, [token])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/20',
          label: 'VERIFICADO',
          description: 'Este documento é autêntico e não foi alterado'
        }
      case 'tampered':
        return {
          icon: AlertTriangle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          label: 'ALTERADO',
          description: 'Este documento foi modificado após a geração'
        }
      case 'expired':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          label: 'EXPIRADO',
          description: 'O link de verificação expirou'
        }
      default:
        return {
          icon: AlertTriangle,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/20',
          label: 'DESCONHECIDO',
          description: 'Status de verificação desconhecido'
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Verificando documento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Erro na Verificação</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusInfo = getStatusInfo(verificationData?.status)
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Vistoria Check</span>
            <Badge variant="secondary" className="ml-4">
              Verificação Pública
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Verification Status */}
          <Card className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-full ${statusInfo.bgColor}`}>
                  <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
                </div>
                <div>
                  <Badge 
                    variant="secondary" 
                    className={`${statusInfo.bgColor} ${statusInfo.color} text-lg px-4 py-2 font-bold mb-2`}
                  >
                    {statusInfo.label}
                  </Badge>
                  <p className="text-lg font-medium mb-2">
                    {statusInfo.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Token: {token}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Information */}
          {verificationData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Documento</CardTitle>
                  <CardDescription>
                    Detalhes da vistoria verificada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Número da Vistoria</p>
                        <p className="text-sm text-muted-foreground">
                          {verificationData.inspection.number}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Cliente</p>
                        <p className="text-sm text-muted-foreground">
                          {verificationData.inspection.client}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Local</p>
                        <p className="text-sm text-muted-foreground">
                          {verificationData.inspection.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Inspetor</p>
                        <p className="text-sm text-muted-foreground">
                          {verificationData.inspection.inspector}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Data da Vistoria</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(verificationData.inspection.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Técnicas</CardTitle>
                  <CardDescription>
                    Dados de integridade e verificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Hash SHA-256</p>
                    <code className="text-xs bg-muted p-2 rounded block break-all">
                      {verificationData.hash}
                    </code>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">PDF Gerado em</p>
                      <p className="text-muted-foreground">
                        {new Date(verificationData.generated_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Visualizações</p>
                      <p className="text-muted-foreground">
                        {verificationData.views} vezes
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          {verificationData && verificationData.status === 'verified' && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Download do Documento</h3>
                    <p className="text-sm text-muted-foreground">
                      Baixe o PDF original desta vistoria
                    </p>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Esta verificação é válida e foi gerada pelo sistema Vistoria Check Secure.
            </p>
            <p className="mt-2">
              Para dúvidas sobre este documento, entre em contato com a organização responsável.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}