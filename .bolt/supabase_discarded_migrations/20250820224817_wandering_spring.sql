/*
  # Dados Iniciais (Seeds)

  1. Templates padrão para diferentes tipos de vistoria
  2. Dados de exemplo para demonstração
  3. Configurações iniciais
*/

-- TEMPLATES PADRÃO
INSERT INTO public.templates (id, organization_id, name, description, schema_json, is_active, version) VALUES
-- Template será inserido via código após criação da organização
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Imóvel - Entrega de Chaves', 'Template completo para vistoria de imóveis residenciais e comerciais', '{
  "sections": [
    {
      "id": "sala",
      "title": "Sala de Estar",
      "items": [
        {"key": "pintura_sala", "label": "Pintura das paredes", "type": "status", "requirePhoto": false},
        {"key": "piso_sala", "label": "Piso", "type": "status", "requirePhoto": false},
        {"key": "janelas_sala", "label": "Janelas", "type": "status", "requirePhoto": true},
        {"key": "portas_sala", "label": "Portas", "type": "status", "requirePhoto": false},
        {"key": "teto_sala", "label": "Teto", "type": "status", "requirePhoto": false},
        {"key": "iluminacao_sala", "label": "Iluminação", "type": "status", "requirePhoto": false},
        {"key": "observacoes_sala", "label": "Observações gerais", "type": "text", "requirePhoto": false}
      ]
    },
    {
      "id": "cozinha",
      "title": "Cozinha",
      "items": [
        {"key": "bancadas", "label": "Bancadas", "type": "status", "requirePhoto": false},
        {"key": "torneiras", "label": "Torneiras", "type": "status", "requirePhoto": true},
        {"key": "azulejos", "label": "Azulejos", "type": "status", "requirePhoto": false},
        {"key": "armarios_cozinha", "label": "Armários", "type": "status", "requirePhoto": false},
        {"key": "eletrodomesticos", "label": "Eletrodomésticos", "type": "status", "requirePhoto": true},
        {"key": "observacoes_cozinha", "label": "Observações", "type": "text", "requirePhoto": false}
      ]
    },
    {
      "id": "banheiros",
      "title": "Banheiros",
      "items": [
        {"key": "sanitarios", "label": "Sanitários", "type": "status", "requirePhoto": false},
        {"key": "chuveiro", "label": "Chuveiro/Banheira", "type": "status", "requirePhoto": false},
        {"key": "azulejos_banheiro", "label": "Azulejos", "type": "status", "requirePhoto": false},
        {"key": "torneiras_banheiro", "label": "Torneiras", "type": "status", "requirePhoto": false},
        {"key": "ventilacao", "label": "Ventilação", "type": "status", "requirePhoto": false}
      ]
    },
    {
      "id": "quartos",
      "title": "Quartos",
      "items": [
        {"key": "pintura_quartos", "label": "Pintura", "type": "status", "requirePhoto": false},
        {"key": "piso_quartos", "label": "Piso", "type": "status", "requirePhoto": false},
        {"key": "armarios_quartos", "label": "Armários embutidos", "type": "status", "requirePhoto": false},
        {"key": "janelas_quartos", "label": "Janelas", "type": "status", "requirePhoto": false}
      ]
    },
    {
      "id": "areas_externas",
      "title": "Áreas Externas",
      "items": [
        {"key": "varanda", "label": "Varanda/Sacada", "type": "status", "requirePhoto": true},
        {"key": "jardim", "label": "Jardim/Quintal", "type": "status", "requirePhoto": false},
        {"key": "garagem", "label": "Garagem", "type": "status", "requirePhoto": false},
        {"key": "portoes", "label": "Portões", "type": "status", "requirePhoto": false}
      ]
    }
  ]
}', true, 1) ON CONFLICT DO NOTHING;

-- Função para criar templates seed quando uma organização é criada
CREATE OR REPLACE FUNCTION create_seed_templates_for_org(org_id uuid)
RETURNS void AS $$
BEGIN
  -- Template Imóvel
  INSERT INTO public.templates (organization_id, name, description, schema_json, is_active, version) VALUES
  (org_id, 'Imóvel - Entrega de Chaves', 'Template completo para vistoria de imóveis residenciais e comerciais', '{
    "sections": [
      {
        "id": "sala",
        "title": "Sala de Estar",
        "items": [
          {"key": "pintura_sala", "label": "Pintura das paredes", "type": "status", "requirePhoto": false},
          {"key": "piso_sala", "label": "Piso", "type": "status", "requirePhoto": false},
          {"key": "janelas_sala", "label": "Janelas", "type": "status", "requirePhoto": true},
          {"key": "portas_sala", "label": "Portas", "type": "status", "requirePhoto": false},
          {"key": "teto_sala", "label": "Teto", "type": "status", "requirePhoto": false},
          {"key": "iluminacao_sala", "label": "Iluminação", "type": "status", "requirePhoto": false},
          {"key": "observacoes_sala", "label": "Observações gerais", "type": "text", "requirePhoto": false}
        ]
      },
      {
        "id": "cozinha", 
        "title": "Cozinha",
        "items": [
          {"key": "bancadas", "label": "Bancadas", "type": "status", "requirePhoto": false},
          {"key": "torneiras", "label": "Torneiras", "type": "status", "requirePhoto": true},
          {"key": "azulejos", "label": "Azulejos", "type": "status", "requirePhoto": false},
          {"key": "armarios_cozinha", "label": "Armários", "type": "status", "requirePhoto": false},
          {"key": "eletrodomesticos", "label": "Eletrodomésticos", "type": "status", "requirePhoto": true},
          {"key": "observacoes_cozinha", "label": "Observações", "type": "text", "requirePhoto": false}
        ]
      }
    ]
  }', true, 1);

  -- Template Veículo
  INSERT INTO public.templates (organization_id, name, description, schema_json, is_active, version) VALUES
  (org_id, 'Veículo - Inspeção Geral', 'Template para vistoria de veículos e frotas', '{
    "sections": [
      {
        "id": "exterior",
        "title": "Exterior",
        "items": [
          {"key": "pintura_veiculo", "label": "Pintura", "type": "status", "requirePhoto": true},
          {"key": "parachoques", "label": "Para-choques", "type": "status", "requirePhoto": true},
          {"key": "faros", "label": "Faróis", "type": "status", "requirePhoto": false},
          {"key": "pneus", "label": "Pneus", "type": "status", "requirePhoto": true},
          {"key": "rodas", "label": "Rodas", "type": "status", "requirePhoto": false}
        ]
      },
      {
        "id": "interior",
        "title": "Interior", 
        "items": [
          {"key": "bancos", "label": "Bancos", "type": "status", "requirePhoto": false},
          {"key": "painel", "label": "Painel", "type": "status", "requirePhoto": true},
          {"key": "ar_condicionado", "label": "Ar condicionado", "type": "status", "requirePhoto": false},
          {"key": "som", "label": "Sistema de som", "type": "status", "requirePhoto": false}
        ]
      },
      {
        "id": "mecanica",
        "title": "Mecânica",
        "items": [
          {"key": "motor", "label": "Motor", "type": "status", "requirePhoto": true},
          {"key": "freios", "label": "Freios", "type": "status", "requirePhoto": false},
          {"key": "suspensao", "label": "Suspensão", "type": "status", "requirePhoto": false},
          {"key": "km_atual", "label": "Quilometragem atual", "type": "number", "requirePhoto": true}
        ]
      }
    ]
  }', true, 1);

  -- Template Equipamento
  INSERT INTO public.templates (organization_id, name, description, schema_json, is_active, version) VALUES
  (org_id, 'Equipamento Industrial', 'Template para inspeção de equipamentos e maquinário', '{
    "sections": [
      {
        "id": "identificacao",
        "title": "Identificação",
        "items": [
          {"key": "numero_serie", "label": "Número de série", "type": "text", "requirePhoto": true},
          {"key": "modelo", "label": "Modelo", "type": "text", "requirePhoto": false},
          {"key": "fabricante", "label": "Fabricante", "type": "text", "requirePhoto": false},
          {"key": "ano_fabricacao", "label": "Ano de fabricação", "type": "number", "requirePhoto": false}
        ]
      },
      {
        "id": "estado_geral",
        "title": "Estado Geral",
        "items": [
          {"key": "estrutura", "label": "Estrutura", "type": "status", "requirePhoto": true},
          {"key": "pintura_equipamento", "label": "Pintura", "type": "status", "requirePhoto": false},
          {"key": "componentes", "label": "Componentes", "type": "status", "requirePhoto": true},
          {"key": "funcionamento", "label": "Funcionamento", "type": "status", "requirePhoto": false}
        ]
      },
      {
        "id": "seguranca",
        "title": "Segurança",
        "items": [
          {"key": "dispositivos_seguranca", "label": "Dispositivos de segurança", "type": "status", "requirePhoto": true},
          {"key": "sinalizacao", "label": "Sinalização", "type": "status", "requirePhoto": false},
          {"key": "certificacoes", "label": "Certificações", "type": "status", "requirePhoto": true}
        ]
      }
    ]
  }', true, 1);
END;
$$ LANGUAGE plpgsql;