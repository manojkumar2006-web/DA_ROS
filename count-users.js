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
    
    // Count users
    const count = await db.collection('users').countDocuments();
    console.log(`Current user count: ${count}`);
    
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
