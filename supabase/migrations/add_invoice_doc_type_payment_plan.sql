-- Add document type to invoices (invoice vs quotation)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS doc_type TEXT NOT NULL DEFAULT 'invoice';

-- Add payment plan fields
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_plan_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS installment_count INTEGER;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS installment_interval TEXT; -- monthly, bi-weekly, weekly
