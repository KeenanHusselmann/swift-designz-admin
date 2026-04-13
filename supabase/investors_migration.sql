-- Add 'investor' to income_source enum
ALTER TYPE income_source ADD VALUE IF NOT EXISTS 'investor';

-- Add 'investment' to income_category enum
ALTER TYPE income_category ADD VALUE IF NOT EXISTS 'investment';

-- Add investor_id column to income_entries
ALTER TABLE income_entries
  ADD COLUMN IF NOT EXISTS investor_id UUID REFERENCES investors(id) ON DELETE SET NULL;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_income_investor ON income_entries(investor_id);
