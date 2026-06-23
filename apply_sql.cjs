const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Sathwik0708@db.wkushhfyhmvljucdvxyf.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function applyMigrations() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');

    const migrationsDir = path.join(__dirname, 'supabase', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Migrations directory not found at ${migrationsDir}`);
    }

    // Read all files from the migrations directory
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort alphabetically to run them in chronological order

    console.log(`Found ${files.length} SQL migrations to apply.`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Executing ${file}...`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute the migration query
      await client.query(sql);
      console.log(`✓ ${file} applied successfully.`);
    }
    
    console.log('All migrations applied successfully!');
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    await client.end();
  }
}

applyMigrations();
