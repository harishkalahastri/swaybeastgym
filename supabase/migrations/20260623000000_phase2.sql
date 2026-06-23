-- Phase 2: Business System Architecture
-- This migration establishes the strict lead lifecycle schema

-- Drop existing tables if necessary (assuming fresh start for Phase 2)
DROP TABLE IF EXISTS contact_requests;
DROP TABLE IF EXISTS program_consultations;
DROP TABLE IF EXISTS membership_inquiries;
DROP TABLE IF EXISTS assessment_submissions;
DROP TABLE IF EXISTS leads;

-- Master Leads Table
-- Identity Key: phone
CREATE TABLE leads (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255),
    first_touch_source VARCHAR(255) DEFAULT 'direct',
    last_touch_source VARCHAR(255) DEFAULT 'direct',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    lead_score INT DEFAULT 0
);

-- Child Table: assessment_submissions
CREATE TABLE assessment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    goal VARCHAR(255),
    experience VARCHAR(255),
    status VARCHAR(50) DEFAULT 'completed',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Child Table: membership_inquiries
CREATE TABLE membership_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    plan_name VARCHAR(255),
    inquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Child Table: program_consultations
CREATE TABLE program_consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    program_name VARCHAR(255),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Child Table: contact_requests
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) REFERENCES leads(phone) ON DELETE CASCADE,
    message TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
