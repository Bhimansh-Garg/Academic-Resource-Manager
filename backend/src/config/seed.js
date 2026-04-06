const pool = require('./db.js');

async function runSeed() {
  try {
    console.log('Seeding departments...');
    await pool.query(`
      INSERT INTO departments (name) VALUES 
      ('Computer Science and Engineering'), 
      ('Electronics and Communication'), 
      ('Mechanical Engineering')
      ON CONFLICT DO NOTHING;
    `);

    console.log('Seeding subjects...');
    await pool.query(`
      INSERT INTO subjects (name, semester, department_id) VALUES
      ('Software Engineering', 6, 1),
      ('Operating Systems', 6, 1),
      ('Computer Networks', 6, 1),
      ('Database Management Systems', 5, 1),
      ('Data Structures', 3, 1)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error running seeder:', error);
  } finally {
    pool.end();
  }
}

runSeed();
