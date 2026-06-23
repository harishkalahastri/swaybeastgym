-- Phase 8.1: Validation Intelligence & Learning Engine
-- Extracting actionable intelligence from real-world traffic

-- 1. Funnel Diagnostics (High Resolution)
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS assessment_last_action VARCHAR(50); 
-- e.g., 'goal_selected', 'coach_viewed', 'roadmap_opened', 'phone_entered'

CREATE OR REPLACE VIEW view_assessment_funnel AS
SELECT 
    assessment_last_action,
    COUNT(*) as dropoff_count
FROM leads
WHERE assessment_completed_at IS NULL AND assessment_last_action IS NOT NULL
GROUP BY assessment_last_action
ORDER BY dropoff_count DESC;

-- 2. Trial Intelligence
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS trial_booking_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS trial_attendance_date TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE VIEW view_trial_delay AS
SELECT 
    phone,
    name,
    EXTRACT(DAY FROM (trial_attendance_date - trial_booking_date)) as days_delayed
FROM leads
WHERE trial_attendance_date IS NOT NULL;

CREATE OR REPLACE VIEW view_trial_conversion AS
SELECT 
    COUNT(*) as total_booked,
    SUM(CASE WHEN trial_attendance_date IS NOT NULL THEN 1 ELSE 0 END) as total_attended,
    CASE 
        WHEN COUNT(*) > 0 THEN ROUND((SUM(CASE WHEN trial_attendance_date IS NOT NULL THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2)
        ELSE 0 
    END as show_rate_percentage
FROM leads
WHERE trial_booking_date IS NOT NULL;

-- 3. CRM Compliance Tracking
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS conversation_duration INT, -- in minutes
ADD COLUMN IF NOT EXISTS conversation_quality VARCHAR(50);

CREATE OR REPLACE VIEW view_crm_compliance AS
SELECT 
    followup_owner,
    COUNT(*) as total_logged_conversations,
    SUM(CASE WHEN conversation_duration >= 2 THEN 1 ELSE 0 END) as valid_conversations,
    CASE 
        WHEN COUNT(*) > 0 THEN ROUND((SUM(CASE WHEN conversation_duration >= 2 THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2)
        ELSE 0 
    END as compliance_rate_percentage
FROM leads
WHERE contact_attempts > 0
GROUP BY followup_owner;

-- 4. Source Quality Intelligence
CREATE OR REPLACE VIEW view_source_quality AS
SELECT 
    first_touch_source,
    COUNT(*) as lead_count,
    SUM(CASE WHEN trial_booking_date IS NOT NULL THEN 1 ELSE 0 END) as trial_count,
    SUM(CASE WHEN membership_closed = TRUE THEN 1 ELSE 0 END) as membership_count,
    ROUND(AVG(lead_score), 2) as avg_lead_score
FROM leads
GROUP BY first_touch_source;

-- 5. Validation Notes System
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS validation_note TEXT;
