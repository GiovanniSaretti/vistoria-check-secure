import { useState, useEffect } from 'react'
import { useInspection } from '@/hooks/useInspections'
import { useTemplate } from '@/hooks/useTemplates'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HeroButton } from '@/components/ui/hero-button'
import { StatusBadge } from '@/components/ui/status-badge'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { 
  CheckCircle, 
  AlertTriangle, 
  MinusCircle, 
  Camera, 
  FileText, 
  PenTool,
  Save,
  Upload
} from 'lucide-react'

interface InspectionFormProps {
  inspectionId: string
}

type ItemStatus = 'ok' | 'pending' | 'na' | null

export function InspectionForm({ inspectionId }: InspectionFormProps) {
  const { inspection, loading } = useInspection(inspectionId)
  const { template } = useTemplate(inspection?.template_id || '')
  
  const [selectedSection, setSelectedSection] = useState(0)
  const [itemValues, setItemValues] = useState<Record<string, any>>({})
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  // Load existing data
  useEffect(() => {
    if (inspection?.data_json) {
      setItemValues(inspection.data_json)
    }
    if (inspection?.inspection_items) {
      const notes: Record<string, string> = {}
      inspection.inspection_items.forEach((item: any) => {
        if (item.notes) {
          notes[item.path] = item.notes
        }
      })
      setItemNotes(notes)
    }
  }, [inspection])

  const handleStatusChange = (itemKey: string, status: ItemStatus) => {
    setItemValues(prev => ({ ...prev, [itemKey]: status }))
    autoSave({ [itemKey]: status })
  }

  const handleValueChange = (itemKey: string, value: string) => {
    setItemValues(prev => ({ ...prev, [itemKey]: value }))
    autoSave({ [itemKey]: value })
  }

  const handleNotesChange = (itemKey: string, notes: string) => {
    setItemNotes(prev => ({ ...prev, [itemKey]: notes }))
    autoSave({}, { [itemKey]: notes })
  }

  const autoSave = async (values: Record<string, any> = {}, notes: Record<string, string> = {}) => {
    if (!inspection) return

    setSaving(true)
    try {
      // Update inspection data
      const newData = { ...itemValues, ...values }
      await supabase
        .from('inspections')
        .update({ 
          data_json: newData,
          updated_at: new Date().toISOString()
        })
        .eq('id', inspection.id)

      // Update notes if provided
      if (Object.keys(notes).length > 0) {
        for (const [path, noteText] of Object.entries(notes)) {
          await supabase
            .from('inspection_items')
            .upsert({
              inspection_id: inspection.id,
              path,
              label: path, // Will be updated with proper label
              type: 'status',
              notes: noteText
            })
        }
      }
    } catch (error) {
      console.error('Auto-save error:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (itemKey: string, file: File) => {
    if (!inspection) return

    setUploading(prev => ({ ...prev, [itemKey]: true }))
    
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${inspection.id}/${itemKey}/${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      // Save photo record
      await supabase
        .from('photos')
        .insert({
          inspection_id: inspection.id,
          item_path: itemKey,
          file_url: publicUrl,
          filename: file.name,
          file_size: file.size,
          mime_type: file.type
        })

      toast.success('Foto enviada com sucesso!')
    } catch (error: any) {
      toast.error('Erro ao enviar foto: ' + error.message)
    } finally {
      setUploading(prev => ({ ...prev, [itemKey]: false }))
    }
  }

  if (loading || !inspection || !template) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const sections = template.schema_json?.sections || []
  const currentSection = sections[selectedSection]
  const completedItems = Object.keys(itemValues).length
  const totalItems = sections.reduce((total: number, section: any) => 
    total + (section.items?.length || 0), 0
  )

  return (
    <Card className="shadow-medium max-w-6xl mx-auto">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {inspection.title || template.name}
            </CardTitle>
            <CardDescription>
              {inspection.number} • {inspection.context_json?.client || 'Cliente não informado'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Save className="h-4 w-4 animate-pulse" />
                Salvando...
              </div>
            )}
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

      <div className="flex min-h-[600px]">
        {/* Sidebar - Seções */}
        <div className="w-64 border-r bg-muted/30">
          <div className="p-4 border-b">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Seções
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {sections.map((section: any, index: number) => (
              <button
                key={section.id || index}
                onClick={() => setSelectedSection(index)}
                className={`w-full text-left p-3 rounded-lg transition-smooth ${
                  selectedSection === index 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="font-medium">{section.title}</div>
                <div className="text-xs opacity-75 mt-1">
                  {section.items?.length || 0} itens
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Itens da Seção */}
        <div className="flex-1">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">{currentSection?.title}</h2>
              <Badge variant="secondary">
                {currentSection?.items?.length || 0} itens
              </Badge>
            </div>

            <div className="space-y-4">
              {(currentSection?.items || []).map((item: any) => (
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
                    {itemValues[item.key] && item.type === 'status' && (
                      <StatusBadge status={itemValues[item.key]} size="sm" />
                    )}
                  </div>

                  {/* Form Controls */}
                  {item.type === 'status' && (
                    <div className="flex gap-2">
                      <Button
                        variant={itemValues[item.key] === "ok" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(item.key, "ok")}
                        className={itemValues[item.key] === "ok" ? "bg-success hover:bg-success/90 text-white" : ""}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        OK
                      </Button>
                      <Button
                        variant={itemValues[item.key] === "pending" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(item.key, "pending")}
                        className={itemValues[item.key] === "pending" ? "bg-warning hover:bg-warning/90 text-white" : ""}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Pendência
                      </Button>
                      <Button
                        variant={itemValues[item.key] === "na" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusChange(item.key, "na")}
                        className={itemValues[item.key] === "na" ? "bg-muted hover:bg-muted/90" : ""}
                      >
                        <MinusCircle className="mr-2 h-4 w-4" />
                        N/A
                      </Button>
                    </div>
                  )}

                  {item.type === 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor={item.key}>{item.label}</Label>
                      <Textarea
                        id={item.key}
                        value={itemValues[item.key] || ''}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        placeholder={`Digite ${item.label.toLowerCase()}...`}
                        className="min-h-[80px]"
                      />
                    </div>
                  )}

                  {item.type === 'number' && (
                    <div className="space-y-2">
                      <Label htmlFor={item.key}>{item.label}</Label>
                      <Input
                        id={item.key}
                        type="number"
                        value={itemValues[item.key] || ''}
                        onChange={(e) => handleValueChange(item.key, e.target.value)}
                        placeholder={`Digite ${item.label.toLowerCase()}...`}
                      />
                    </div>
                  )}

                  {/* Notes para itens com pendência */}
                  {itemValues[item.key] === "pending" && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Observações da pendência:
                      </Label>
                      <Textarea 
                        placeholder="Descreva o problema encontrado..."
                        className="min-h-[60px]"
                        value={itemNotes[item.key] || ''}
                        onChange={(e) => handleNotesChange(item.key, e.target.value)}
                      />
                    </div>
                  )}

                  {/* Photo Upload Area */}
                  {item.requirePhoto && (
                    <div className="pt-2 border-t">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handlePhotoUpload(item.key, file)
                        }}
                        className="hidden"
                        id={`photo-${item.key}`}
                      />
                      <label htmlFor={`photo-${item.key}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full cursor-pointer"
                          disabled={uploading[item.key]}
                          asChild
                        >
                          <span>
                            {uploading[item.key] ? (
                              <>
                                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                                Enviando...
                              </>
                            ) : (
                              <>
                                <Camera className="mr-2 h-4 w-4" />
                                Adicionar Foto
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
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