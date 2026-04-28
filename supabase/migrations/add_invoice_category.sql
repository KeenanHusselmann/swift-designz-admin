 -- Add income_category to invoices so payments auto-create the correct category
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS category income_category NOT NULL DEFAULT 'web_dev';

-- Fix the three existing income_entries that were created with the wrong category.
-- Match by invoice_number via the linked invoice_id.
UPDATE income_entries ie
SET category = 'ecommerce'
FROM invoices inv
WHERE ie.invoice_id = inv.id
  AND inv.invoice_number IN ('INV-2026-006', 'INV-2026-007', 'INV-2026-008');

-- Demote intern to viewer (no Investors/Team access)
UPDATE profiles
SET role = 'viewer', updated_at = now()
WHERE email = 'anteswift12@gmail.com';
