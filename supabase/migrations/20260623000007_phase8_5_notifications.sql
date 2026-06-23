-- Phase 8.5: Notification Reliability Tracking
CREATE TABLE IF NOT EXISTS notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT NOT NULL, -- Ties to SB-TRIAL-0001, etc.
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    channel TEXT NOT NULL, -- e.g., 'WHATSAPP_OWNER', 'EMAIL_OWNER', 'WHATSAPP_LEAD'
    status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed, retried
    retry_count INTEGER DEFAULT 0,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notification_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read all notification events" ON notification_events FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');
