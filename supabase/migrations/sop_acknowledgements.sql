-- SOP Acknowledgements
-- Tracks which employee has signed off which SOP document

CREATE TABLE IF NOT EXISTS sop_acknowledgements (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sop_id      TEXT        NOT NULL,
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sop_id, user_id)
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_sop_ack_user ON sop_acknowledgements(user_id);

-- RLS
ALTER TABLE sop_acknowledgements ENABLE ROW LEVEL SECURITY;

-- Admin/viewer can see all acknowledgements
CREATE POLICY "admin_viewer_select_sop_ack"
  ON sop_acknowledgements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'viewer')
    )
  );

-- Investor can only see their own
CREATE POLICY "investor_select_own_sop_ack"
  ON sop_acknowledgements FOR SELECT
  USING (user_id = auth.uid());

-- Any authenticated user can insert their own acknowledgement
CREATE POLICY "authenticated_insert_sop_ack"
  ON sop_acknowledgements FOR INSERT
  WITH CHECK (user_id = auth.uid());
