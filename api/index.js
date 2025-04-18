const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');
const PORT = 4000;

app.use(cors()); 
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  password: 'Admin@321',
  host: 'localhost',
  port: 5432,
  database: 'journaldb'
});

app.get('/api/entries', async (req, res) => {
  try {
    const journalEntries = await pool.query(`
      SELECT 
        je.id, je.entry_date, je.description, 
        jel.account, jel.debit_amount, jel.credit_amount
      FROM journal_entry je
      JOIN journal_entry_line jel ON je.id = jel.journal_entry_id
      ORDER BY je.entry_date DESC, je.id DESC
    `);

    res.json(journalEntries.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/entries', async (req, res) => {
  const client = await pool.connect();
  const { entry_date, description, debit_account, credit_account, amount } = req.body;
  if (!entry_date || !description || !debit_account || !credit_account || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (debit_account === credit_account) {
    return res.status(400).json({ error: "Debit and Credit accounts cannot be the same" });
  }

  if (isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ error: "Amount must be a positive number" });
  }

  try {
    await client.query('BEGIN');

    const journalRes = await client.query(
      `INSERT INTO journal_entry (entry_date, description)
       VALUES ($1, $2)
       RETURNING id`,
      [entry_date, description]
    );

    const je_id = journalRes.rows[0].id;

    await client.query(
      `INSERT INTO journal_entry_line (journal_entry_id, account, debit_amount, credit_amount)
       VALUES 
         ($1, $2, $3, 0),
         ($1, $4, 0, $3)`,
      [je_id, debit_account, amount, credit_account]
    );

    await client.query(
      `INSERT INTO ledger_entry (posting_date, account, debit_amount, credit_amount, ref_type, ref_id)
       VALUES 
         ($1, $2, $3, 0, 'JournalEntry', $4),
         ($1, $5, 0, $3, 'JournalEntry', $4)`,
      [entry_date, debit_account, amount, je_id, credit_account]
    );

    await client.query('COMMIT');

    res.status(201).json({ message: 'Journal entry created successfully', journal_entry_id: je_id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create journal entry' });
  } finally {
    client.release();
  }
});


app.get('/api/ledger', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ledger_entry ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
