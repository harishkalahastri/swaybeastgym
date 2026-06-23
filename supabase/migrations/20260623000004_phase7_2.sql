-- Phase 7.2: Data Quality Enforcement
-- Forcing the database to defend itself against lazy data entry.

-- 1. Ensure columns exist
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS membership_plan VARCHAR(100),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'NEW'; 
-- We'll assume 'status' is the main state column (NEW, CONTACTED, TRIAL_BOOKED, TRIAL_COMPLETED, MEMBER, LOST) as per Phase 2.

-- 2. Membership Revenue Enforcement
-- Cannot mark as MEMBER unless membership_plan and membership_value are populated.
ALTER TABLE leads
ADD CONSTRAINT chk_membership_revenue 
CHECK (
    (status != 'MEMBER') OR 
    (status = 'MEMBER' AND membership_plan IS NOT NULL AND membership_value > 0)
);

-- 3. Objection Intelligence Enforcement
-- Cannot mark as LOST without objection_category (reason_lost)
ALTER TABLE leads
ADD CONSTRAINT chk_reason_lost 
CHECK (
    (status != 'LOST') OR 
    (status = 'LOST' AND reason_lost IS NOT NULL)
);

-- 4. Terminal Outcome Rule (The 14-Day Sweep)
-- Since setting up a pg_cron job depends on the Supabase tier, the easiest and most robust method 
-- is to create a View that acts as a "Violation Dashboard" for the owner to clear out.
CREATE OR REPLACE VIEW view_terminal_violations AS
SELECT 
    phone,
    name,
    status,
    last_activity_at,
    EXTRACT(DAY FROM CURRENT_TIMESTAMP - last_activity_at) AS days_stagnant
FROM leads
WHERE status = 'CONTACTED' 
AND last_activity_at < CURRENT_TIMESTAMP - INTERVAL '14 days';
