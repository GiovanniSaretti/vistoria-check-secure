import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  FileText, 
  Hash, 
  CheckSquare,
  Eye,
  Save,
  Undo,
  Redo
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";

interface TemplateItem {
  key: string;
  label: string;
  type: "status" | "text" | "number";
  requirePhoto: boolean;
}

interface TemplateSection {
  title: string;
  items: TemplateItem[];
}

interface TemplateSchema {
  sections: TemplateSection[];
}

interface TemplateBuilderProps {
  initialTemplate?: {
    id?: string;
    name: string;
    description?: string;
    schema_json: TemplateSchema;
  };
  onSave: (template: {
    name: string;
    description?: string;
    schema_json: TemplateSchema;
  }) => Promise<void>;
  onPreview: (schema: TemplateSchema) => void;
}

export const TemplateBuilder = ({ initialTemplate, onSave, onPreview }: TemplateBuilderProps) => {
  const [name, setName] = useState(initialTemplate?.name || "");
  const [description, setDescription] = useState(initialTemplate?.description || "");
  const [sections, setSections] = useState<TemplateSection[]>(
    initialTemplate?.schema_json.sections || [
      {
        title: "Informações Gerais",
        items: [
          {
            key: "location",
            label: "Local da Vistoria",
            type: "text",
            requirePhoto: false
          },
          {
            key: "inspector_name",
            label: "Nome do Inspetor",
            type: "text",
            requirePhoto: false
          }
        ]
      }
    ]
  );
  
  const [history, setHistory] = useState<TemplateSection[][]>([sections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  const saveToHistory = useCallback((newSections: TemplateSection[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSections)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const addSection = () => {
    const newSections = [...sections, {
      title: `Nova Seção ${sections.length + 1}`,
      items: []
    }];
    setSections(newSections);
    saveToHistory(newSections);
  };

  const updateSection = (sectionIndex: number, updates: Partial<TemplateSection>) => {
    const newSections = sections.map((section, index) =>
      index === sectionIndex ? { ...section, ...updates } : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const deleteSection = (sectionIndex: number) => {
    const newSections = sections.filter((_, index) => index !== sectionIndex);
    setSections(newSections);
    saveToHistory(newSections);
  };

  const addItem = (sectionIndex: number) => {
    const newItem: TemplateItem = {
      key: `item_${Date.now()}`,
      label: "Novo Item",
      type: "status",
      requirePhoto: false
    };
    
    const newSections = sections.map((section, index) =>
      index === sectionIndex
        ? { ...section, items: [...section.items, newItem] }
        : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const updateItem = (sectionIndex: number, itemIndex: number, updates: Partial<TemplateItem>) => {
    const newSections = sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            items: section.items.map((item, iIndex) =>
              iIndex === itemIndex ? { ...item, ...updates } : item
            )
          }
        : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const deleteItem = (sectionIndex: number, itemIndex: number) => {
    const newSections = sections.map((section, sIndex) =>
      sIndex === sectionIndex
        ? {
            ...section,
            items: section.items.filter((_, iIndex) => iIndex !== itemIndex)
          }
        : section
    );
    setSections(newSections);
    saveToHistory(newSections);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "section") {
      const newSections = Array.from(sections);
      const [reorderedSection] = newSections.splice(source.index, 1);
      newSections.splice(destination.index, 0, reorderedSection);
      setSections(newSections);
      saveToHistory(newSections);
    } else if (type === "item") {
      const sectionIndex = parseInt(source.droppableId);
      const newSections = [...sections];
      const items = Array.from(newSections[sectionIndex].items);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      newSections[sectionIndex] = { ...newSections[sectionIndex], items };
      setSections(newSections);
      saveToHistory(newSections);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do template é obrigatório",
        variant: "destructive"
      });
      return;
    }

    if (sections.length === 0) {
      toast({
        title: "Erro", 
        description: "Template deve ter pelo menos uma seção",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        schema_json: { sections }
      });
      
      toast({
        title: "Sucesso",
        description: "Template salvo com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar template",
        variant: "destructive"
      });
    }
  };

  const handlePreview = () => {
    onPreview({ sections });
    setIsPreviewMode(true);
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case "status": return <CheckSquare className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
      case "number": return <Hash className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case "status": return "Status (OK/PEND/N/A)";
      case "text": return "Texto";
      case "number": return "Número";
      default: return type;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Template Builder</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Pré-visualizar
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vistoria de Imóvel"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o propósito deste template"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" type="section">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <Draggable
                  key={sectionIndex}
                  draggableId={`section-${sectionIndex}`}
                  index={sectionIndex}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          </div>
                          <div className="flex-1">
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                              className="font-semibold text-lg border-none p-0 h-auto focus-visible:ring-0"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSection(sectionIndex)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <Droppable droppableId={sectionIndex.toString()} type="item">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                              {section.items.map((item, itemIndex) => (
                                <Draggable
                                  key={`${sectionIndex}-${itemIndex}`}
                                  draggableId={`item-${sectionIndex}-${itemIndex}`}
                                  index={itemIndex}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="bg-muted/30 rounded-lg p-4"
                                    >
                                      <div className="flex items-center space-x-4">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                                          <div>
                                            <Label className="text-xs">Rótulo</Label>
                                            <Input
                                              value={item.label}
                                              onChange={(e) => updateItem(sectionIndex, itemIndex, { label: e.target.value })}
                                              placeholder="Nome do campo"
                                            />
                                          </div>
                                          
                                          <div>
                                            <Label className="text-xs">Chave</Label>
                                            <Input
                                              value={item.key}
                                              onChange={(e) => updateItem(sectionIndex, itemIndex, { key: e.target.value })}
                                              placeholder="campo_chave"
                                            />
                                          </div>
                                          
                                          <div>
                                            <Label className="text-xs">Tipo</Label>
                                            <Select
                                              value={item.type}
                                              onValueChange={(value: "status" | "text" | "number") => 
                                                updateItem(sectionIndex, itemIndex, { type: value })
                                              }
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="status">
                                                  <div className="flex items-center space-x-2">
                                                    <CheckSquare className="h-4 w-4" />
                                                    <span>Status</span>
                                                  </div>
                                                </SelectItem>
                                                <SelectItem value="text">
                                                  <div className="flex items-center space-x-2">
                                                    <FileText className="h-4 w-4" />
                                                    <span>Texto</span>
                                                  </div>
                                                </SelectItem>
                                                <SelectItem value="number">
                                                  <div className="flex items-center space-x-2">
                                                    <Hash className="h-4 w-4" />
                                                    <span>Número</span>
                                                  </div>
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          
                                          <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                              <Switch
                                                checked={item.requirePhoto}
                                                onCheckedChange={(checked) => 
                                                  updateItem(sectionIndex, itemIndex, { requirePhoto: checked })
                                                }
                                              />
                                              <Label className="text-xs">Foto obrigatória</Label>
                                            </div>
                                            
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => deleteItem(sectionIndex, itemIndex)}
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Item Preview */}
                                      <div className="mt-3 p-3 bg-background rounded border">
                                        <div className="flex items-center space-x-2 text-sm">
                                          {getItemTypeIcon(item.type)}
                                          <span className="font-medium">{item.label}</span>
                                          <Badge variant="secondary" className="text-xs">
                                            {getItemTypeName(item.type)}
                                          </Badge>
                                          {item.requirePhoto && (
                                            <Badge variant="outline" className="text-xs">
                                              📷 Foto obrigatória
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              
                              <Button
                                variant="outline"
                                onClick={() => addItem(sectionIndex)}
                                className="w-full border-dashed"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Adicionar Item
                              </Button>
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Section Button */}
      <Button onClick={addSection} className="w-full border-dashed" variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Nova Seção
      </Button>
    </div>
  );
};