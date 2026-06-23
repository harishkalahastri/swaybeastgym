-- Phase 7: Revenue Attribution & Sales Accountability Engine
-- 1. Sales Activity Tracking
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS contact_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_contact_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS contact_outcome VARCHAR(50);
-- Valid outcomes: 'Interested', 'Not Interested', 'Call Back Later', 'Trial Booked', 'No Response'

-- 2. Lead Quality Validation Layer
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS lead_quality_score VARCHAR(50);
-- Valid scores: 'Low' (Assessment Only), 'Medium' (Trial Requested), 'High' (Membership Inquiry), 'Confirmed' (Joined)

-- 3. Sales Outcome Intelligence
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS reason_joined VARCHAR(100),
ADD COLUMN IF NOT EXISTS reason_lost VARCHAR(100);

-- 4. Revenue Attribution & KPI Views (SQL Layer)

-- view_revenue_by_source
CREATE OR REPLACE VIEW view_revenue_by_source AS
SELECT 
    first_touch_source,
    COUNT(*) as total_leads,
    SUM(CASE WHEN membership_closed = TRUE THEN 1 ELSE 0 END) as total_memberships,
    SUM(membership_value) as total_revenue
FROM leads
GROUP BY first_touch_source;

-- view_revenue_by_campaign
CREATE OR REPLACE VIEW view_revenue_by_campaign AS
SELECT 
    (nl.payload->>'utm_campaign') AS campaign_name,
    COUNT(DISTINCT l.phone) as total_leads,
    SUM(CASE WHEN l.membership_closed = TRUE THEN 1 ELSE 0 END) as total_memberships,
    SUM(l.membership_value) as total_revenue
FROM notification_logs nl
JOIN leads l ON nl.lead_phone = l.phone
GROUP BY campaign_name;

-- view_assessment_to_membership_rate
CREATE OR REPLACE VIEW view_assessment_to_membership_rate AS
SELECT 
    COUNT(*) AS total_assessments,
    SUM(CASE WHEN membership_closed = TRUE THEN 1 ELSE 0 END) AS total_memberships,
    CASE 
        WHEN COUNT(*) > 0 THEN 
            ROUND((SUM(CASE WHEN membership_closed = TRUE THEN 1 ELSE 0 END)::numeric / COUNT(*)) * 100, 2)
        ELSE 0 
    END AS conversion_rate_percentage
FROM leads
WHERE assessment_completed_at IS NOT NULL;

-- view_revenue_per_lead
CREATE OR REPLACE VIEW view_revenue_per_lead AS
SELECT 
    COUNT(*) AS total_leads,
    SUM(membership_value) AS total_revenue,
    CASE 
        WHEN COUNT(*) > 0 THEN ROUND(SUM(membership_value) / COUNT(*), 2)
        ELSE 0 
    END AS revenue_per_lead
FROM leads;

-- 5. Operational Alert Rules (Escalations Table)
CREATE TABLE IF NOT EXISTS operational_alerts (
    id SERIAL PRIMARY KEY,
    lead_phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    alert_type VARCHAR(100),
    alert_message TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to generate alerts on high-value events
CREATE OR REPLACE FUNCTION trigger_operational_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Alert for SALES_READY
    IF NEW.lead_temperature = 'SALES_READY' AND (OLD.lead_temperature IS DISTINCT FROM 'SALES_READY') THEN
        INSERT INTO operational_alerts (lead_phone, alert_type, alert_message)
        VALUES (NEW.phone, 'URGENT', 'New SALES_READY Lead generated.');
    END IF;

    -- Note: Escalation for overdue follow-up >24 hours is usually checked via a scheduled cron job.
    -- We track the structure here.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS operational_alerts_trigger ON leads;

CREATE TRIGGER operational_alerts_trigger
AFTER INSERT OR UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION trigger_operational_alerts();
