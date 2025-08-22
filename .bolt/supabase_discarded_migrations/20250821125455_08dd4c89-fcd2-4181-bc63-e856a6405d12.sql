-- Update organizations table to match specification
ALTER TABLE public.organizations 
  ADD COLUMN IF NOT EXISTS plan text CHECK (plan IN ('free', 'payg', 'starter', 'pro', 'business')) DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS billing_status text DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}';

-- Create profiles table updates
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('admin', 'inspector', 'reviewer')) DEFAULT 'inspector';

-- Update templates table
ALTER TABLE public.templates
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;

-- Update inspections table
ALTER TABLE public.inspections
  ADD COLUMN IF NOT EXISTS parent_inspection_id uuid REFERENCES public.inspections(id),
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Create billing_customers table
CREATE TABLE IF NOT EXISTS public.billing_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe', 'mercado_pago')),
  customer_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, provider)
);

-- Create billing_subscriptions table
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe', 'mercado_pago')),
  subscription_id text NOT NULL UNIQUE,
  plan text CHECK (plan IN ('starter', 'pro', 'business')),
  status text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create billing_invoices table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe', 'mercado_pago')),
  invoice_id text NOT NULL UNIQUE,
  amount integer NOT NULL,
  currency text DEFAULT 'brl',
  paid boolean DEFAULT false,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create usage_counters table
CREATE TABLE IF NOT EXISTS public.usage_counters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  month text NOT NULL, -- YYYY-MM format
  pdf_count integer DEFAULT 0,
  public_links_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, month)
);

-- Enable RLS on new tables
ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for billing tables
CREATE POLICY "Users can view their org billing customers" ON public.billing_customers
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage their org billing customers" ON public.billing_customers
  FOR ALL USING (user_has_org_access(organization_id));

CREATE POLICY "Users can view their org billing subscriptions" ON public.billing_subscriptions
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage their org billing subscriptions" ON public.billing_subscriptions
  FOR ALL USING (user_has_org_access(organization_id));

CREATE POLICY "Users can view their org billing invoices" ON public.billing_invoices
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage their org billing invoices" ON public.billing_invoices
  FOR ALL USING (user_has_org_access(organization_id));

CREATE POLICY "Users can view their org usage counters" ON public.usage_counters
  FOR SELECT USING (user_has_org_access(organization_id));

CREATE POLICY "Users can manage their org usage counters" ON public.usage_counters
  FOR ALL USING (user_has_org_access(organization_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inspections_org_created ON public.inspections(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_org_active ON public.templates(organization_id, is_active);
CREATE INDEX IF NOT EXISTS idx_public_links_token ON public.public_links(token);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_org ON public.billing_subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_usage_counters_org_month ON public.usage_counters(organization_id, month);

-- Add trigger for updated_at columns
CREATE TRIGGER update_billing_customers_updated_at
  BEFORE UPDATE ON public.billing_customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_subscriptions_updated_at
  BEFORE UPDATE ON public.billing_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_invoices_updated_at
  BEFORE UPDATE ON public.billing_invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_counters_updated_at
  BEFORE UPDATE ON public.usage_counters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();