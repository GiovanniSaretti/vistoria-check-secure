/*
  # Row Level Security (RLS) Policies

  1. Habilita RLS em todas as tabelas
  2. Cria políticas baseadas em organização
  3. Garante isolamento completo entre organizações
  4. Permite acesso público apenas para links públicos
*/

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- FUNÇÃO HELPER PARA VERIFICAR ACESSO À ORGANIZAÇÃO
CREATE OR REPLACE FUNCTION user_has_org_access(org_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.organization_id = org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS PARA ORGANIZATIONS
CREATE POLICY "Users can view their organizations" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their org" ON public.organizations
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view profiles in their organizations" ON public.profiles
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage profiles in their org" ON public.profiles
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- POLÍTICAS PARA TEMPLATES
CREATE POLICY "Users can view templates in their org" ON public.templates
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage templates in their org" ON public.templates
  FOR ALL USING (user_has_org_access(organization_id));

-- POLÍTICAS PARA INSPECTIONS
CREATE POLICY "Users can view inspections in their org" ON public.inspections
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage inspections in their org" ON public.inspections
  FOR ALL USING (user_has_org_access(organization_id));

-- POLÍTICAS PARA INSPECTION_ITEMS
CREATE POLICY "Users can view inspection items" ON public.inspection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_items.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can manage inspection items" ON public.inspection_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = inspection_items.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

-- POLÍTICAS PARA PHOTOS
CREATE POLICY "Users can view photos" ON public.photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = photos.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can manage photos" ON public.photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = photos.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

-- POLÍTICAS PARA SIGNATURES
CREATE POLICY "Users can view signatures" ON public.signatures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = signatures.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can manage signatures" ON public.signatures
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = signatures.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

-- POLÍTICAS PARA PDFS
CREATE POLICY "Users can view PDFs" ON public.pdfs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = pdfs.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can manage PDFs" ON public.pdfs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = pdfs.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

-- POLÍTICAS PARA PUBLIC_LINKS
CREATE POLICY "Users can view public links" ON public.public_links
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = public_links.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can manage public links" ON public.public_links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.inspections i
      WHERE i.id = public_links.inspection_id
        AND user_has_org_access(i.organization_id)
    )
  );

-- POLÍTICA ESPECIAL PARA ACESSO PÚBLICO (verificação)
CREATE POLICY "Public access to non-revoked links" ON public.public_links
  FOR SELECT USING (
    NOT is_revoked 
    AND expires_at > now()
    AND type = 'verification'
  );

-- POLÍTICAS PARA AUDIT_LOGS
CREATE POLICY "Users can view audit logs in their org" ON public.audit_logs
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (user_has_org_access(organization_id));