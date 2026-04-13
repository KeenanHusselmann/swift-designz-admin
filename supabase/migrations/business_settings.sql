-- Swift Designz Admin — Business Settings table
-- Run against linked Supabase DB

CREATE TABLE business_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT '',
  tagline TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  website TEXT,
  vat_number TEXT,
  registration_number TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_branch_code TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read
CREATE POLICY "Authenticated users can read business_settings"
  ON business_settings FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can insert business_settings"
  ON business_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update business_settings"
  ON business_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed a single row (singleton pattern)
INSERT INTO business_settings (company_name, email, phone, website, city, country)
VALUES ('Swift Designz', 'hello@swiftdesignz.co.za', '', 'https://swiftdesignz.co.za', 'Windhoek', 'Namibia');
