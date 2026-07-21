const { MongoClient } = require('mongodb');
const fs = require('fs');

async function run() {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const uriMatch = envFile.match(/MONGODB_URI=(.*)/);
  const uri = uriMatch ? uriMatch[1] : null;
  if (!uri) throw new Error('No MONGODB_URI found');

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    // Delete all users
    const result = await db.collection('users').deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} users from the database.`);
    
    // Also clear attendance records since they refer to users
    const attResult = await db.collection('attendances').deleteMany({});
    console.log(`Successfully deleted ${attResult.deletedCount} attendance records.`);
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
