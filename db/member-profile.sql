-- Run once on the existing PostgreSQL database before starting the updated app.
ALTER TABLE member ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE member ADD COLUMN IF NOT EXISTS height_cm integer;
ALTER TABLE member ADD COLUMN IF NOT EXISTS account_type varchar(255);
UPDATE member SET account_type = 'USER' WHERE account_type IS NULL;
