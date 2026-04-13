-- Allow manual progress override (0–100). NULL = auto-calculate from milestones.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS progress_override INTEGER;
