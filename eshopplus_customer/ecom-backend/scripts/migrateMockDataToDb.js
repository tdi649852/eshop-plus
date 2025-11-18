const fs = require('fs').promises;
const path = require('path');
const { initDb, getPool } = require('../config/database');

async function seedMocks() {
  const mockDirectory = path.join(__dirname, '..', 'mockData');
  const pool = await getPool();

  const entries = await fs.readdir(mockDirectory);
  const jsonFiles = entries.filter((file) => file.toLowerCase().endsWith('.json'));

  if (!jsonFiles.length) {
    console.log('No JSON files found in mockData directory.');
    return;
  }

  console.log(`Seeding ${jsonFiles.length} mock files into MySQL...`);

  for (const file of jsonFiles) {
    const endpoint = path.basename(file, '.json');
    const filePath = path.join(mockDirectory, file);

    try {
      const rawData = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(rawData);
      const normalizedPayload = JSON.stringify(parsed);

      await pool.query(
        `INSERT INTO mock_payloads (endpoint, payload)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE payload = VALUES(payload)`,
        [endpoint, normalizedPayload],
      );
      console.log(`✓ Seeded ${endpoint}`);
    } catch (error) {
      console.error(`✗ Failed to seed ${endpoint}: ${error.message}`);
    }
  }
}

initDb()
  .then(seedMocks)
  .then(() => {
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });

