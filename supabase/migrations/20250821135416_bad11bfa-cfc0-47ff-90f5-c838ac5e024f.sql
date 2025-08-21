-- Create storage buckets for the application
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('photos', 'photos', false),
  ('signatures', 'signatures', false),
  ('pdfs', 'pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for photos bucket
CREATE POLICY "Users can upload photos to their org" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can view photos from their org" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'photos' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

-- Create RLS policies for signatures bucket
CREATE POLICY "Users can upload signatures to their org" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'signatures' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can view signatures from their org" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'signatures' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

-- Create RLS policies for PDFs bucket
CREATE POLICY "Users can upload PDFs to their org" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pdfs' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

CREATE POLICY "Users can view PDFs from their org" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pdfs' AND
    EXISTS (
      SELECT 1 FROM inspections i
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND user_has_org_access(i.organization_id)
    )
  );

-- Public access for verified links
CREATE POLICY "Public access to PDFs via verification links" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pdfs' AND
    EXISTS (
      SELECT 1 FROM public_links pl
      JOIN inspections i ON i.id = pl.inspection_id
      WHERE i.id = (storage.foldername(name))[1]::uuid
      AND pl.type = 'verification'
      AND NOT pl.is_revoked
      AND pl.expires_at > now()
    )
  );