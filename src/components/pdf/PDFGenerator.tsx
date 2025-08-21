import { useState } from 'react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { HeroButton } from '@/components/ui/hero-button'
import { supabase } from '@/integrations/supabase/client'
import { canonicalJSONString, generateInspectionCanonicalData } from '@/lib/canonical'
import { generateInspectionHash } from '@/lib/hash-browser'
import { toast } from '@/components/ui/sonner'
import { FileText, Download, Share2 } from 'lucide-react'

interface PDFGeneratorProps {
  inspection: any
  onPDFGenerated?: (pdfData: any) => void
}

export function PDFGenerator({ inspection, onPDFGenerated }: PDFGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const generatePDF = async () => {
    if (!inspection) return

    setGenerating(true)

    try {
      // Generate canonical data and hash
      const canonicalData = generateInspectionCanonicalData(inspection)
      const canonicalJson = canonicalJSONString(canonicalData)
      const hash = await generateInspectionHash(canonicalJson)

      // Create public verification link
      const token = generateSecureToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // 30 days

      const { data: linkData, error: linkError } = await supabase
        .from('public_links')
        .insert({
          inspection_id: inspection.id,
          token,
          type: 'verification',
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (linkError) throw linkError

      // Generate QR Code for verification link
      const verificationUrl = `${import.meta.env.VITE_APP_URL}/p/${token}`
      const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
        width: 100,
        margin: 1
      })

      // Create PDF
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Header
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('RELATÓRIO DE VISTORIA', pageWidth / 2, 30, { align: 'center' })

      // Inspection details
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      let yPos = 50

      pdf.text(`Número: ${inspection.number}`, 20, yPos)
      yPos += 10
      pdf.text(`Título: ${inspection.title || 'Sem título'}`, 20, yPos)
      yPos += 10
      pdf.text(`Cliente: ${inspection.context_json?.client || 'Não informado'}`, 20, yPos)
      yPos += 10
      pdf.text(`Data: ${new Date(inspection.created_at).toLocaleDateString('pt-BR')}`, 20, yPos)
      yPos += 10
      pdf.text(`Status: ${getStatusLabel(inspection.status)}`, 20, yPos)
      yPos += 20

      // Template sections and items
      if (inspection.template?.schema_json?.sections) {
        for (const section of inspection.template.schema_json.sections) {
          // Section header
          pdf.setFont('helvetica', 'bold')
          pdf.text(section.title, 20, yPos)
          yPos += 10

          pdf.setFont('helvetica', 'normal')
          
          for (const item of section.items || []) {
            const value = inspection.data_json?.[item.key]
            const status = getStatusLabel(value)
            
            pdf.text(`• ${item.label}: ${status}`, 25, yPos)
            yPos += 8

            // Add notes if available
            const itemData = inspection.inspection_items?.find((i: any) => i.path === item.key)
            if (itemData?.notes) {
              pdf.setFontSize(10)
              pdf.text(`  Obs: ${itemData.notes}`, 30, yPos)
              yPos += 6
              pdf.setFontSize(12)
            }

            // Check if we need a new page
            if (yPos > pageHeight - 60) {
              pdf.addPage()
              yPos = 30
            }
          }
          
          yPos += 10
        }
      }

      // Signatures section
      if (inspection.signatures?.length > 0) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('ASSINATURAS', 20, yPos)
        yPos += 15

        pdf.setFont('helvetica', 'normal')
        for (const signature of inspection.signatures) {
          pdf.text(`${signature.role === 'inspector' ? 'Inspetor' : 'Cliente'}: ${signature.signed_by_name}`, 20, yPos)
          yPos += 8
          pdf.text(`Data: ${new Date(signature.signed_at).toLocaleString('pt-BR')}`, 20, yPos)
          yPos += 15
        }
      }

      // Footer with hash and QR code
      const footerY = pageHeight - 40
      pdf.setFontSize(8)
      pdf.text(`HASH: ${hash}`, 20, footerY)
      pdf.text(`Verificação: ${verificationUrl}`, 20, footerY + 8)

      // Add QR Code
      pdf.addImage(qrCodeDataURL, 'PNG', pageWidth - 50, footerY - 20, 30, 30)

      // Convert to blob
      const pdfBlob = pdf.output('blob')
      
      // Upload PDF to storage
      const fileName = `${inspection.number}_${Date.now()}.pdf`
      const filePath = `${inspection.id}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf'
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath)

      // Save PDF record
      const { data: pdfData, error: pdfError } = await supabase
        .from('pdfs')
        .insert({
          inspection_id: inspection.id,
          file_url: publicUrl,
          filename: fileName,
          file_size: pdfBlob.size,
          sha256: hash,
          canonical_json: canonicalJson
        })
        .select()
        .single()

      if (pdfError) throw pdfError

      // Download PDF
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('PDF gerado com sucesso!')
      onPDFGenerated?.(pdfData)

    } catch (error: any) {
      toast.error('Erro ao gerar PDF: ' + error.message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex gap-3">
      <HeroButton 
        onClick={generatePDF} 
        disabled={generating}
        variant="hero"
      >
        {generating ? (
          <>
            <FileText className="mr-2 h-4 w-4 animate-pulse" />
            Gerando PDF...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Gerar PDF
          </>
        )}
      </HeroButton>

      {inspection.pdfs?.length > 0 && (
        <Button variant="outline" onClick={() => downloadLatestPDF(inspection)}>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      )}
    </div>
  )
}

function generateSecureToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ok': return 'OK'
    case 'pending': return 'Pendência'
    case 'na': return 'N/A'
    case 'draft': return 'Rascunho'
    case 'awaiting_sign': return 'Aguardando Assinatura'
    case 'signed': return 'Assinada'
    case 'archived': return 'Arquivada'
    default: return status || 'Não informado'
  }
}

async function downloadLatestPDF(inspection: any) {
  if (!inspection.pdfs?.length) return

  const latestPdf = inspection.pdfs[inspection.pdfs.length - 1]
  
  try {
    const response = await fetch(latestPdf.file_url)
    const blob = await response.blob()
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = latestPdf.filename || `${inspection.number}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    toast.error('Erro ao baixar PDF')
  }
}