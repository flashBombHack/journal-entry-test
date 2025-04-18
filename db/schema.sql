CREATE TABLE journal_entry (
  id SERIAL PRIMARY KEY,
  entry_date DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal_entry_line (
  id SERIAL PRIMARY KEY,
  journal_entry_id INT NOT NULL REFERENCES journal_entry(id),
  account VARCHAR(255) NOT NULL,
  debit_amount NUMERIC(15,2) DEFAULT 0,
  credit_amount NUMERIC(15,2) DEFAULT 0
);

CREATE TABLE ledger_entry (
  id SERIAL PRIMARY KEY,
  posting_date DATE NOT NULL,
  account VARCHAR(255) NOT NULL,
  debit_amount NUMERIC(15,2) DEFAULT 0,
  credit_amount NUMERIC(15,2) DEFAULT 0,
  ref_type VARCHAR(50),
  ref_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
