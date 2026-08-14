BEGIN;

ALTER TABLE processing_jobs
    RENAME CONSTRAINT processing_jobs_document_version_id_not_null
    TO processing_jobs_target_version_id_not_null;

COMMIT;
