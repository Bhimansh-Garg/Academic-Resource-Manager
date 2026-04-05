const fs = require('fs');
const path = require('path');
const pool = require('./db.js');

async function runMigration() {
  try {
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await pool.query(sqlQuery);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    pool.end();
  }
}

runMigration();
