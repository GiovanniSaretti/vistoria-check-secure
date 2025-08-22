-- ORGANIZAÇÕES E PERFIS
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text check (plan in ('free','payg','starter','pro','business')) default 'free',
  billing_status text,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  organization_id uuid not null references public.organizations(id),
  role text check (role in ('admin','inspector','reviewer')) not null,
  name text, email text,
  created_at timestamptz default now()
);

-- TEMPLATES / VISTORIAS / ITENS
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  name text not null,
  schema_json jsonb not null,
  version int not null default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  template_id uuid not null references public.templates(id),
  parent_inspection_id uuid null references public.inspections(id) on delete set null,
  number text not null,
  status text check (status in ('draft','awaiting_sign','signed','archived')) default 'draft',
  context_json jsonb,
  created_by uuid references public.profiles(id),
  signed_at timestamptz,
  created_at timestamptz default now(),
  unique (organization_id, number)
);

create table if not exists public.inspection_items (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  path text,
  label text,
  type text check (type in ('status','text','number')) not null,
  value text,
  notes text,
  require_photo boolean default false
);

-- FOTOS / ASSINATURAS
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  item_path text,
  file_url text not null,
  thumb_url text,
  exif_json jsonb,
  created_at timestamptz default now()
);

create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  role text check (role in ('inspector','client')) not null,
  signed_by_name text,
  signed_at timestamptz,
  ip text,
  geo_json jsonb,
  file_url text not null
);

-- PDFS / LINKS PÚBLICOS / AUDITORIA / USO
create table if not exists public.pdfs (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  file_url text not null,              -- URL completa (opcional)
  storage_path text,                   -- caminho no bucket (ex: pdfs/org/inspec/file.pdf)
  sha256 text not null,
  generated_at timestamptz default now(),
  processing boolean default false
);

create table if not exists public.public_links (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  token text not null unique,
  mode text check (mode in ('verify','sign')) default 'verify',
  expires_at timestamptz not null,
  views_count int default 0,
  is_revoked boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  actor_id uuid references public.profiles(id),
  action text,
  entity text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id),
  month text not null,
  pdf_count int default 0,
  public_links_count int default 0,
  unique (organization_id, month)
);

-- RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_items enable row level security;
alter table public.photos enable row level security;
alter table public.signatures enable row level security;
alter table public.pdfs enable row level security;
alter table public.public_links enable row level security;
alter table public.audit_logs enable row level security;
alter table public.usage_counters enable row level security;

-- POLICIES idempotentes (repete padrão p/ cada tabela com organization_id)
-- organizations (owner pode ver a própria org)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='organizations' AND policyname='orgs_select_owner') THEN
    EXECUTE $$CREATE POLICY "orgs_select_owner" ON public.organizations
      FOR SELECT USING ( owner_id = auth.uid() )$$;
  END IF;
END$$;

-- profiles (mesma org)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='profiles_same_org_select') THEN
    EXECUTE $$CREATE POLICY "profiles_same_org_select" ON public.profiles
      FOR SELECT USING (
        exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.organization_id = profiles.organization_id)
      )$$;
  END IF;
END$$;

-- helper para criar 4 policies nas tabelas com organization_id
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['templates','inspections','inspection_items','photos','signatures','pdfs','public_links','audit_logs','usage_counters']
  LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname=t||'_select_same_org') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.organization_id = %I.organization_id))', t||'_select_same_org', t, t);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname=t||'_insert_same_org') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.organization_id = %I.organization_id))', t||'_insert_same_org', t, t);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname=t||'_update_same_org') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE USING (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.organization_id = %I.organization_id))', t||'_update_same_org', t, t);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname=t||'_delete_same_org') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE USING (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.organization_id = %I.organization_id))', t||'_delete_same_org', t, t);
    END IF;
  END LOOP;
END$$;

-- ÍNDICES úteis
create index if not exists idx_inspections_org_created on public.inspections (organization_id, created_at desc);
create index if not exists idx_templates_org_active on public.templates (organization_id, is_active);
create index if not exists idx_public_links_token on public.public_links (token);
