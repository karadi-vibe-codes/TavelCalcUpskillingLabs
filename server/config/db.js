import { MongoClient } from 'mongodb';

let db;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  const client = new MongoClient(uri);
  await client.connect();

  db = client.db(process.env.DB_NAME || 'myapp');
  console.log(`Connected to MongoDB: ${db.databaseName}`);

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });

  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call connectDB() first.');
  return db;
}
