-- Add 'comment' column to 'credit' table
ALTER TABLE credit
ADD COLUMN comment TEXT NULL;

ALTER TABLE credit ADD COLUMN quantity BIGINT NOT NULL DEFAULT 0;
