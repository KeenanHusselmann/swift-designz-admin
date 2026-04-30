-- Add accounting_access flag to profiles
-- Admins always have access via code logic; this flag applies to viewer/employee accounts.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS accounting_access boolean NOT NULL DEFAULT false;

-- Grant access to the specific employee
UPDATE profiles
SET accounting_access = true
WHERE email = 'anteswift12@gmail.com';
