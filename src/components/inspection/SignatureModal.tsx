import { useState, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HeroButton } from '@/components/ui/hero-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { PenTool, RotateCcw, Save } from 'lucide-react'

interface SignatureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inspectionId: string
  role: 'inspector' | 'client'
  onSignatureComplete?: () => void
}

export function SignatureModal({ 
  open, 
  onOpenChange, 
  inspectionId, 
  role,
  onSignatureComplete 
}: SignatureModalProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [signerName, setSignerName] = useState('')
  const [signerEmail, setSignerEmail] = useState('')
  const [consentGeo, setConsentGeo] = useState(false)
  const [consentLGPD, setConsentLGPD] = useState(false)
  const [saving, setSaving] = useState(false)

  const clearSignature = () => {
    signatureRef.current?.clear()
  }

  const saveSignature = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Por favor, assine no campo acima')
      return
    }

    if (!signerName.trim()) {
      toast.error('Por favor, informe seu nome')
      return
    }

    if (!consentLGPD) {
      toast.error('É necessário aceitar os termos de tratamento de dados')
      return
    }

    setSaving(true)

    try {
      // Get signature as data URL
      const signatureDataURL = signatureRef.current.toDataURL('image/png')
      
      // Convert to blob
      const response = await fetch(signatureDataURL)
      const blob = await response.blob()

      // Create unique filename
      const fileName = `${inspectionId}/${role}/${Date.now()}.png`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(fileName, blob, {
          contentType: 'image/png'
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('signatures')
        .getPublicUrl(fileName)

      // Get user location if consented
      let geoData = {}
      if (consentGeo && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false
            })
          })
          
          geoData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }
        } catch (error) {
          console.warn('Could not get location:', error)
        }
      }

      // Save signature record
      await supabase
        .from('signatures')
        .insert({
          inspection_id: inspectionId,
          role,
          signed_by_name: signerName.trim(),
          signed_by_email: signerEmail.trim() || null,
          ip_address: null, // Could be obtained from a service
          user_agent: navigator.userAgent,
          geo_json: geoData,
          file_url: publicUrl
        })

      // Update inspection status if both signatures are complete
      const { data: signatures } = await supabase
        .from('signatures')
        .select('role')
        .eq('inspection_id', inspectionId)

      const hasInspectorSig = signatures?.some(s => s.role === 'inspector')
      const hasClientSig = signatures?.some(s => s.role === 'client')

      if (hasInspectorSig && hasClientSig) {
        await supabase
          .from('inspections')
          .update({ 
            status: 'signed',
            signed_at: new Date().toISOString()
          })
          .eq('id', inspectionId)
      }

      toast.success('Assinatura salva com sucesso!')
      onSignatureComplete?.()
      onOpenChange(false)
      
      // Reset form
      setSignerName('')
      setSignerEmail('')
      setConsentGeo(false)
      setConsentLGPD(false)
      signatureRef.current?.clear()

    } catch (error: any) {
      toast.error('Erro ao salvar assinatura: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Assinatura {role === 'inspector' ? 'do Inspetor' : 'do Cliente'}
          </DialogTitle>
          <DialogDescription>
            Assine no campo abaixo para confirmar a vistoria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Signature Canvas */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas w-full h-full border rounded'
              }}
              backgroundColor="rgb(255, 255, 255)"
            />
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" onClick={clearSignature}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </div>

          {/* Signer Information */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="signer-name">Nome Completo *</Label>
              <Input
                id="signer-name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signer-email">Email (opcional)</Label>
              <Input
                id="signer-email"
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Consents */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent-geo"
                checked={consentGeo}
                onCheckedChange={(checked) => setConsentGeo(checked === true)}
              />
              <Label htmlFor="consent-geo" className="text-sm leading-relaxed">
                Autorizo a captura da minha localização para fins de auditoria (opcional)
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent-lgpd"
                checked={consentLGPD}
                onCheckedChange={(checked) => setConsentLGPD(checked === true)}
                required
              />
              <Label htmlFor="consent-lgpd" className="text-sm leading-relaxed">
                Li e aceito os termos de tratamento de dados pessoais conforme LGPD *
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <HeroButton onClick={saveSignature} disabled={saving}>
              {saving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-pulse" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Assinatura
                </>
              )}
            </HeroButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}