BEGIN;

ALTER TABLE processing_jobs
    DROP CONSTRAINT processing_jobs_policy_version_check;

ALTER TABLE processing_jobs
    ALTER COLUMN policy_version TYPE text
    USING policy_version::text;

COMMIT;
