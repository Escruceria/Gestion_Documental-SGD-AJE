BEGIN;

ALTER TABLE processing_jobs
    DROP CONSTRAINT processing_jobs_document_version_fk;

ALTER TABLE processing_jobs
    RENAME COLUMN document_version_id TO target_version_id;

ALTER TABLE processing_jobs
    DROP CONSTRAINT processing_jobs_source_message_unique;

ALTER TABLE processing_jobs
    ADD CONSTRAINT processing_jobs_source_message_job_unique
        UNIQUE (source_message_id, job_type);

COMMIT;
