import { MongoClient, type Db } from "mongodb";

// One MongoClient per server instance. In development, Next.js reloads modules on every change,
// so the client is kept on globalThis to avoid opening a new connection each time.

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "portfolio";

const g = globalThis as unknown as { _mongo?: Promise<MongoClient> };

export function hasDb() {
  return Boolean(uri);
}

export async function getDb(): Promise<Db> {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!g._mongo) g._mongo = new MongoClient(uri, { maxPoolSize: 5 }).connect();
  return (await g._mongo).db(dbName);
}
