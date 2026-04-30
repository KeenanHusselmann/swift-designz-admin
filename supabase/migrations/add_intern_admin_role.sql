-- Add intern_admin role to the user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'intern_admin';

-- Set anteswift12 as intern_admin (replaces any previous accounting_access flag approach)
UPDATE profiles
SET role = 'intern_admin',
    accounting_access = true
WHERE email = 'anteswift12@gmail.com';
