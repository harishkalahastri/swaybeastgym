-- Phase 8.5: Customer Portal Foundation

-- 1. Customers Table (Unified Profile)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can read own data" ON customers FOR SELECT USING (auth.uid()::text = id::text OR auth.jwt() ->> 'phone' = phone_number);
CREATE POLICY "Admins read all customers" ON customers FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 2. Customer Activities Ledger
CREATE TABLE IF NOT EXISTS customer_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}'::jsonb,
    client_submission_id UUID UNIQUE NOT NULL, -- Safeguard 1: Deduplication
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE customer_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own activities" ON customer_activities FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone' OR id::text = auth.uid()::text)
);
CREATE POLICY "Admins read all activities" ON customer_activities FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 3. Activity Status History
CREATE TABLE IF NOT EXISTS activity_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES customer_activities(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by TEXT NOT NULL, -- User ID or System
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE activity_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own activity history" ON activity_status_history FOR SELECT USING (
    activity_id IN (SELECT id FROM customer_activities WHERE customer_id IN (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone'))
);
CREATE POLICY "Admins read all activity history" ON activity_status_history FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 4. Trial Bookings (Enhanced)
CREATE TABLE IF NOT EXISTS trial_bookings_v2 (
    booking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL, -- e.g., SB-TRIAL-0001
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    preferred_time TEXT,
    goal TEXT,
    trainer_assigned TEXT,
    booking_status TEXT DEFAULT 'REQUESTED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE trial_bookings_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own trials" ON trial_bookings_v2 FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone')
);
CREATE POLICY "Admins read all trials" ON trial_bookings_v2 FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 5. Membership Requests
CREATE TABLE IF NOT EXISTS membership_requests_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    membership_plan TEXT NOT NULL,
    membership_price NUMERIC,
    request_status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE membership_requests_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own memberships" ON membership_requests_v2 FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone')
);
CREATE POLICY "Admins read all memberships" ON membership_requests_v2 FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 6. Program Consultations
CREATE TABLE IF NOT EXISTS program_consultations_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    goal TEXT,
    frequency TEXT,
    experience TEXT,
    matched_program TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE program_consultations_v2 ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own consultations" ON program_consultations_v2 FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE phone_number = auth.jwt() ->> 'phone')
);
CREATE POLICY "Admins read all consultations" ON program_consultations_v2 FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 7. Customer Notes (CRM)
CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_by TEXT NOT NULL, -- e.g. Owner, Reception
    updated_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
-- Notes are admin only
CREATE POLICY "Admins read all notes" ON customer_notes FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- 8. Audit Logs (Safeguard 3)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_role TEXT NOT NULL, -- e.g. System, Admin, Customer
    action TEXT NOT NULL, -- e.g. Lead Status Changed
    entity_type TEXT NOT NULL, -- e.g. membership_requests
    entity_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read all audits" ON audit_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin' OR auth.role() = 'service_role');

-- Reference ID Sequences
CREATE SEQUENCE IF NOT EXISTS trial_ref_seq START 1;
CREATE SEQUENCE IF NOT EXISTS member_ref_seq START 1;
CREATE SEQUENCE IF NOT EXISTS consult_ref_seq START 1;

-- 9. Transactional Submission RPC
CREATE OR REPLACE FUNCTION process_submission(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_customer_id UUID;
    v_activity_id UUID;
    v_reference_id TEXT;
    v_type TEXT;
    v_client_sub_id UUID;
    v_phone TEXT;
    v_name TEXT;
    v_email TEXT;
BEGIN
    v_type := payload->>'type';
    v_client_sub_id := (payload->>'client_submission_id')::UUID;
    v_phone := payload->>'phone_number';
    v_name := payload->>'full_name';
    v_email := payload->>'email';

    -- 1. Deduplication Check
    IF EXISTS (SELECT 1 FROM customer_activities WHERE client_submission_id = v_client_sub_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Duplicate submission id');
    END IF;

    -- 2. Upsert Customer
    INSERT INTO customers (phone_number, full_name, email)
    VALUES (v_phone, v_name, v_email)
    ON CONFLICT (phone_number) DO UPDATE
    SET full_name = EXCLUDED.full_name, email = COALESCE(EXCLUDED.email, customers.email), updated_at = NOW()
    RETURNING id INTO v_customer_id;

    -- 3. Create Activity
    INSERT INTO customer_activities (customer_id, activity_type, activity_data, client_submission_id)
    VALUES (v_customer_id, v_type, payload, v_client_sub_id)
    RETURNING id INTO v_activity_id;

    -- 4. Initial Status History
    INSERT INTO activity_status_history (activity_id, old_status, new_status, changed_by)
    VALUES (v_activity_id, NULL, 'REQUESTED', 'SYSTEM');

    -- 5. Route to specific table
    IF v_type = 'TRIAL' THEN
        v_reference_id := 'SB-TRIAL-' || LPAD(nextval('trial_ref_seq')::text, 4, '0');
        INSERT INTO trial_bookings_v2 (reference_id, customer_id, preferred_time, goal)
        VALUES (v_reference_id, v_customer_id, payload->>'preferred_time', payload->>'goal');
        
    ELSIF v_type = 'MEMBERSHIP' THEN
        v_reference_id := 'SB-MEMBER-' || LPAD(nextval('member_ref_seq')::text, 4, '0');
        INSERT INTO membership_requests_v2 (reference_id, customer_id, membership_plan, membership_price)
        VALUES (v_reference_id, v_customer_id, payload->>'membership_plan', (payload->>'membership_price')::NUMERIC);

    ELSIF v_type = 'CONSULTATION' THEN
        v_reference_id := 'SB-CONSULT-' || LPAD(nextval('consult_ref_seq')::text, 4, '0');
        INSERT INTO program_consultations_v2 (reference_id, customer_id, goal, frequency, experience, matched_program)
        VALUES (v_reference_id, v_customer_id, payload->>'goal', payload->>'frequency', payload->>'experience', payload->>'matched_program');
    END IF;

    -- 6. Audit Log
    INSERT INTO audit_logs (user_role, action, entity_type, entity_id)
    VALUES ('SYSTEM', 'New Submission Processed', v_type, v_reference_id);

    RETURN jsonb_build_object('success', true, 'customer_id', v_customer_id, 'reference_id', v_reference_id);
EXCEPTION WHEN OTHERS THEN
    -- Postgres rolls back automatically on exception in PlpgSQL block
    RAISE EXCEPTION 'Transaction failed: %', SQLERRM;
END;
$$;
