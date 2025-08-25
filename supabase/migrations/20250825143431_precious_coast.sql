/*
  # Delta fixes for production readiness

  1. Schema Updates
    - Add storage_path to pdfs table if missing
    - Fix organizations plan constraint
    - Add unique constraint to profiles

  2. Security
    - Add idempotent policies for inspections
    - Ensure RLS is enabled on all tables

  3. Notes
    - All operations use IF NOT EXISTS to prevent conflicts
    - Safe to run multiple times
*/

-- storage_path em pdfs (se faltar)
ALTER TABLE IF EXISTS public.pdfs
  ADD COLUMN IF NOT EXISTS storage_path text;

-- constraint de planos + RLS em profiles (se faltar)
ALTER TABLE IF EXISTS public.organizations
  DROP CONSTRAINT IF EXISTS organizations_plan_check;
ALTER TABLE IF EXISTS public.organizations
  ADD CONSTRAINT organizations_plan_check
  CHECK (plan IN ('free','payg','starter','pro','business'));

-- unique em profiles (user_id, organization_id) para evitar duplicatas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename='profiles' AND indexname='profiles_user_org_key'
  ) THEN
    CREATE UNIQUE INDEX profiles_user_org_key
      ON public.profiles(user_id, organization_id);
  END IF;
END$$;

-- policies idempotentes (exemplo para inspections; repita padrão se faltar em outras)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='inspections'
      AND policyname='inspections_select_same_org'
  ) THEN
    EXECUTE $$CREATE POLICY "inspections_select_same_org" ON public.inspections
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles p
          WHERE p.user_id = auth.uid()
            AND p.organization_id = inspections.organization_id)
      )$$;
  END IF;
END$$;

-- Ensure RLS is enabled on all tables
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