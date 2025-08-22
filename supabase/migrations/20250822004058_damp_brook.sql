/*
  # Fix billing policies - Idempotent migration
  
  1. Tables
    - Ensure billing_customers table exists with proper structure
    - Ensure billing_subscriptions table exists with proper structure
    - Ensure billing_invoices table exists with proper structure
    
  2. Security
    - Enable RLS on all billing tables
    - Add policies only if they don't exist (prevents duplicates)
    - Use proper organization access checks
*/

-- BILLING_CUSTOMERS table
CREATE TABLE IF NOT EXISTS public.billing_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe','mercado_pago')),
  customer_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;

-- SELECT policy for billing_customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_customers'
      AND policyname='Users can view their org billing customers'
  ) THEN
    CREATE POLICY "Users can view their org billing customers"
    ON public.billing_customers
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_customers.organization_id
      )
    );
  END IF;
END$$;

-- ALL policy for billing_customers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_customers'
      AND policyname='Users can manage their org billing customers'
  ) THEN
    CREATE POLICY "Users can manage their org billing customers"
    ON public.billing_customers
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_customers.organization_id
      )
    );
  END IF;
END$$;

-- BILLING_SUBSCRIPTIONS table
CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe','mercado_pago')),
  subscription_id text UNIQUE NOT NULL,
  plan text CHECK (plan IN ('starter','pro','business')),
  status text,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies for billing_subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_subscriptions'
      AND policyname='Users can view their org billing subscriptions'
  ) THEN
    CREATE POLICY "Users can view their org billing subscriptions"
    ON public.billing_subscriptions
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_subscriptions.organization_id
      )
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_subscriptions'
      AND policyname='Users can manage their org billing subscriptions'
  ) THEN
    CREATE POLICY "Users can manage their org billing subscriptions"
    ON public.billing_subscriptions
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_subscriptions.organization_id
      )
    );
  END IF;
END$$;

-- BILLING_INVOICES table
CREATE TABLE IF NOT EXISTS public.billing_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text CHECK (provider IN ('stripe','mercado_pago')),
  invoice_id text UNIQUE NOT NULL,
  amount integer NOT NULL,
  currency text DEFAULT 'brl',
  paid boolean DEFAULT false,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;

-- Policies for billing_invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_invoices'
      AND policyname='Users can view their org billing invoices'
  ) THEN
    CREATE POLICY "Users can view their org billing invoices"
    ON public.billing_invoices
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_invoices.organization_id
      )
    );
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='billing_invoices'
      AND policyname='Users can manage their org billing invoices'
  ) THEN
    CREATE POLICY "Users can manage their org billing invoices"
    ON public.billing_invoices
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = auth.uid()
          AND p.organization_id = billing_invoices.organization_id
      )
    );
  END IF;
END$$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_billing_customers_updated_at'
  ) THEN
    CREATE TRIGGER update_billing_customers_updated_at
      BEFORE UPDATE ON public.billing_customers
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_billing_subscriptions_updated_at'
  ) THEN
    CREATE TRIGGER update_billing_subscriptions_updated_at
      BEFORE UPDATE ON public.billing_subscriptions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_billing_invoices_updated_at'
  ) THEN
    CREATE TRIGGER update_billing_invoices_updated_at
      BEFORE UPDATE ON public.billing_invoices
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;