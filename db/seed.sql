INSERT INTO journal_entry (entry_date, description)
VALUES ('2025-04-01', 'Office supplies purchase')
RETURNING id
\gset

INSERT INTO journal_entry_line (journal_entry_id, account, debit_amount, credit_amount)
VALUES
(:id, 'Office Supplies', 120.00, 0),
(:id, 'Cash', 0, 120.00);

INSERT INTO ledger_entry (posting_date, account, debit_amount, credit_amount, ref_type, ref_id)
VALUES
('2025-04-01', 'Office Supplies', 120.00, 0, 'JournalEntry', :id),
('2025-04-01', 'Cash', 0, 120.00, 'JournalEntry', :id);
