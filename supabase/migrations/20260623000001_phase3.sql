-- Phase 3: Revenue Conversion Engine
-- Enhancing the master leads table and introducing dynamic scoring

-- 1. Lead Ownership Architecture
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(50) DEFAULT 'owner';

-- 2. Response Time Metrics
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS first_contact_at TIMESTAMP WITH TIME ZONE;

-- Add a computed column for response_minutes
-- Wait, computed columns in Postgres:
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS response_minutes INT GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (first_contact_at - created_at)) / 60
) STORED;

-- 3. Dynamic Lead Temperature
-- In Postgres we can use a generated column or a view. We'll use a generated column.
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_temperature VARCHAR(20) GENERATED ALWAYS AS (
    CASE 
        WHEN lead_score >= 91 THEN 'SALES_READY'
        WHEN lead_score >= 61 THEN 'HOT'
        WHEN lead_score >= 31 THEN 'WARM'
        ELSE 'COLD'
    END
) STORED;

-- 4. Source Quality & Abandoned Journey Tracking
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS assessment_started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assessment_completed_at TIMESTAMP WITH TIME ZONE;

-- 5. Mock Edge Function Trigger setup
-- We'll create a table to log mocked notifications
CREATE TABLE IF NOT EXISTS notification_logs (
    id SERIAL PRIMARY KEY,
    lead_phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    notification_type VARCHAR(50),
    priority VARCHAR(50),
    payload JSONB,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to simulate Notification Path on Lead Insert
CREATE OR REPLACE FUNCTION trigger_mock_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_priority VARCHAR(50);
BEGIN
    -- Determine Priority based on Score
    IF NEW.lead_score >= 90 THEN
        v_priority := 'HIGHEST';
    ELSIF NEW.lead_score >= 60 THEN
        v_priority := 'HIGH';
    ELSIF NEW.lead_score >= 30 THEN
        v_priority := 'MEDIUM';
    ELSE
        v_priority := 'LOW';
    END IF;

    -- Insert mock log
    INSERT INTO notification_logs (lead_phone, notification_type, priority, payload)
    VALUES (NEW.phone, 'EMAIL', v_priority, row_to_json(NEW));

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS lead_notification_trigger ON leads;

CREATE TRIGGER lead_notification_trigger
AFTER INSERT OR UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_mock_notification();
