-- Apply once to the existing leads table. Existing rows become quick enquiries.
ALTER TABLE leads
  ADD COLUMN lead_type ENUM('quick_enquiry','quote_request') NOT NULL DEFAULT 'quick_enquiry' AFTER id,
  ADD KEY idx_leads_type_created (lead_type, created_at);
