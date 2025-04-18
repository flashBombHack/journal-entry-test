const { execSync } = require('child_process');

const DB_USER = 'postgres';
const DB_NAME = 'journaldb';

try {
  console.log('Creating database...');
  execSync(`createdb -U ${DB_USER} ${DB_NAME}`, { stdio: 'inherit' });

  console.log('Applying schema...');
  execSync(`psql -U ${DB_USER} -d ${DB_NAME} -f db/schema.sql`, { stdio: 'inherit' });

  console.log('Seeding data...');
  execSync(`psql -U ${DB_USER} -d ${DB_NAME} -f db/seed.sql`, { stdio: 'inherit' });

  console.log('Database setup complete!');
} catch (err) {
  console.error('Error setting up database:', err.message);
}
