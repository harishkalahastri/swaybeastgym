-- Phase 4, 5, 6: Sales Execution & Operations Visibility
-- Enhancing the master leads table to prevent revenue leaks and enforce sales SLAs

-- 1. Follow-Up & Accountability Layer
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS followup_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS followup_due TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS followup_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS followup_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS followup_owner VARCHAR(50) DEFAULT 'owner',
ADD COLUMN IF NOT EXISTS last_contact_method VARCHAR(50);

-- 2. Membership Closure Tracking (Closed-Loop Revenue)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS membership_closed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS membership_value NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS membership_closed_at TIMESTAMP WITH TIME ZONE;

-- 3. Notification Resiliency & Health Monitoring
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS notification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'retrying'
ADD COLUMN IF NOT EXISTS notification_retry_count INT DEFAULT 0;

-- 4. Set UTM Defaults Strategy via SQL Triggers or Default Constraints
ALTER TABLE leads
ALTER COLUMN first_touch_source SET DEFAULT 'direct',
ALTER COLUMN last_touch_source SET DEFAULT 'direct';

-- 5. Mock Edge Function to generate the Daily Digest
-- This trigger will log a simulated daily digest execution
CREATE TABLE IF NOT EXISTS daily_digest_logs (
    id SERIAL PRIMARY KEY,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_new_leads INT,
    hot_leads_waiting INT,
    overdue_followups INT,
    notification_failures INT,
    payload JSONB
);

-- Note: A real daily digest would be a scheduled cron job (e.g., pg_cron or Supabase Edge Function scheduled)
-- Here we'll simulate a query that would generate this digest:
CREATE OR REPLACE VIEW view_daily_digest AS
SELECT 
    CURRENT_DATE AS digest_date,
    (SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE) AS total_new_leads,
    (SELECT COUNT(*) FROM leads WHERE lead_temperature = 'HOT' AND followup_status = 'pending') AS hot_leads_waiting,
    (SELECT COUNT(*) FROM leads WHERE followup_due < CURRENT_TIMESTAMP AND followup_status = 'pending') AS overdue_followups,
    (SELECT COUNT(*) FROM leads WHERE notification_status = 'failed') AS notification_failures;
