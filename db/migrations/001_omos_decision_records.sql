CREATE TABLE IF NOT EXISTS omos_decision_records (
  request_id TEXT PRIMARY KEY,
  mode TEXT NOT NULL,
  output_status TEXT NOT NULL,
  verification_status TEXT,
  human_decision TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  record JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_omos_decision_records_updated_at
  ON omos_decision_records (updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_omos_decision_records_status
  ON omos_decision_records (output_status);

COMMENT ON TABLE omos_decision_records IS
  'Durable OMOS governed run and Decision Record persistence. Model agreement does not establish factual verification.';