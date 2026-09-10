ALTER TABLE omos_decision_records
  ADD COLUMN IF NOT EXISTS owner_id TEXT,
  ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS record_hash TEXT,
  ADD COLUMN IF NOT EXISTS previous_record_hash TEXT;

UPDATE omos_decision_records
SET owner_id = COALESCE(owner_id, 'legacy:unowned')
WHERE owner_id IS NULL;

ALTER TABLE omos_decision_records
  ALTER COLUMN owner_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_omos_decision_records_owner_updated
  ON omos_decision_records (owner_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS omos_decision_record_revisions (
  request_id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  owner_id TEXT NOT NULL,
  record_hash TEXT NOT NULL,
  previous_record_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  record JSONB NOT NULL,
  PRIMARY KEY (request_id, revision),
  CONSTRAINT fk_omos_decision_record_revision_request
    FOREIGN KEY (request_id)
    REFERENCES omos_decision_records(request_id)
    DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_omos_decision_record_revisions_owner_request
  ON omos_decision_record_revisions (owner_id, request_id, revision ASC);

COMMENT ON COLUMN omos_decision_records.owner_id IS
  'Stable authenticated API-key owner identifier. Record reads and writes are scoped to this owner.';

COMMENT ON TABLE omos_decision_record_revisions IS
  'Append-only revision history used to verify the SHA-256 Decision Record audit chain.';
