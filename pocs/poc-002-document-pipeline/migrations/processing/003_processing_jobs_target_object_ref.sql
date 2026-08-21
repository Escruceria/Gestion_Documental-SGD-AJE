BEGIN;

ALTER TABLE processing_jobs
    ADD COLUMN target_object_ref text NOT NULL;

COMMIT;
