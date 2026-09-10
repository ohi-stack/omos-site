# OMOS-REF-0001 Certification Boundary

Repository proof and production proof are separate gates.

Repository proof currently establishes that the intended persistence, ownership, audit-chain, restart-test, and preflight logic exists and passes CI on the reconciled mainline implementation.

Production proof must additionally establish:

1. exact deployed Git SHA on `omos.onegodian.com`;
2. initialized durable PostgreSQL on the canonical host;
3. one governed Decision Record with server-side Human Gate disposition;
4. reopening that same Decision Record after runtime restart/redeploy;
5. intact ownership and revision/hash audit chain after restart.

Until all five are evidenced, OMOS-REF-0001 remains **NOT CERTIFIED / Functional**.
