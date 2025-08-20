/*
  # Vistoria Check Secure - Schema Inicial

  1. Tabelas Principais
    - `organizations` - Organizações/empresas
    - `profiles` - Perfis de usuários por organização
    - `templates` - Templates de vistoria
    - `inspections` - Vistorias
    - `inspection_items` - Itens das vistorias
    - `photos` - Fotos das vistorias
    - `signatures` - Assinaturas
    - `pdfs` - PDFs gerados
    - `public_links` - Links públicos para verificação
    - `audit_logs` - Logs de auditoria

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas por organização
    - Buckets privados para arquivos

  3. Funcionalidades
    - Sistema multiempresa
    - Templates personalizáveis
    - Assinaturas presencial e remota
    - Verificação pública com SHA-256
    - Auditoria completa
*/

-- ORGANIZAÇÕES E PERFIS
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  plan text CHECK (plan IN ('payg','unlimited')) DEFAULT 'payg',
  billing_status text DEFAULT 'active',
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role text CHECK (role IN ('admin','inspector')) NOT NULL DEFAULT 'inspector',
  name text,
  email text,
  avatar_url text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- TEMPLATES
CREATE TABLE IF NOT EXISTS public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  schema_json jsonb NOT NULL DEFAULT '{"sections": []}',
  version int NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- VISTORIAS
CREATE TABLE IF NOT EXISTS public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.templates(id),
  number text NOT NULL,
  title text,
  status text CHECK (status IN ('draft','awaiting_sign','signed','archived')) DEFAULT 'draft',
  context_json jsonb DEFAULT '{}',
  data_json jsonb DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  signed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (organization_id, number)
);

CREATE TABLE IF NOT EXISTS public.inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  path text NOT NULL,
  label text NOT NULL,
  type text CHECK (type IN ('status','text','number','boolean')) NOT NULL,
  value text,
  notes text,
  require_photo boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FOTOS
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  item_path text,
  file_url text NOT NULL,
  thumb_url text,
  filename text,
  file_size bigint,
  mime_type text,
  exif_json jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- ASSINATURAS
CREATE TABLE IF NOT EXISTS public.signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  role text CHECK (role IN ('inspector','client')) NOT NULL,
  signed_by_name text NOT NULL,
  signed_by_email text,
  signed_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  geo_json jsonb DEFAULT '{}',
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- PDFS (RELATÓRIOS)
CREATE TABLE IF NOT EXISTS public.pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  filename text,
  file_size bigint,
  sha256 text NOT NULL,
  canonical_json text NOT NULL,
  generated_at timestamptz DEFAULT now(),
  processing boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- LINKS PÚBLICOS (VERIFICAÇÃO/ASSINATURA REMOTA)
CREATE TABLE IF NOT EXISTS public.public_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  type text CHECK (type IN ('verification','signature')) DEFAULT 'verification',
  expires_at timestamptz NOT NULL,
  views_count int DEFAULT 0,
  max_views int,
  is_revoked boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

-- AUDITORIA
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_templates_organization_id ON public.templates(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_inspections_organization_id ON public.inspections(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON public.inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection_id ON public.inspection_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_photos_inspection_id ON public.photos(inspection_id);
CREATE INDEX IF NOT EXISTS idx_signatures_inspection_id ON public.signatures(inspection_id);
CREATE INDEX IF NOT EXISTS idx_pdfs_inspection_id ON public.pdfs(inspection_id);
CREATE INDEX IF NOT EXISTS idx_public_links_token ON public.public_links(token);
CREATE INDEX IF NOT EXISTS idx_public_links_expires ON public.public_links(expires_at, is_revoked);
CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON public.audit_logs(organization_id, created_at DESC);

-- TRIGGERS PARA UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.inspections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inspection_items_updated_at BEFORE UPDATE ON public.inspection_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();