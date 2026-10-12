-- Apply once to an existing leads table. Existing rows remain unchanged.
ALTER TABLE leads
    ADD COLUMN company_name VARCHAR(160) NULL AFTER name,
    ADD COLUMN topic VARCHAR(120) NULL AFTER quantity,
    ADD COLUMN budget VARCHAR(120) NULL AFTER topic;
