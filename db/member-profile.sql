-- Run once on the existing PostgreSQL database before starting the updated app.
ALTER TABLE member ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE member ADD COLUMN IF NOT EXISTS height_cm integer;
