import { MongoClient } from "mongodb";

export async function connect(client: string, connectionInfo: any): Promise<MongoClient> {
  // handle connectioninfo
  const mongoConnection = new MongoClient(connectionInfo);
  return await mongoConnection.connect();
}

export async function close(connection: MongoClient): Promise<void> {
  await connection.close();
}

export async function batchQuery(
  connection: MongoClient,
  database: string,
  collection: string,
  query: any,
  offset: number,
  limit: number
): Promise<any[]> {
  const db = connection.db(database).collection(collection);
  return await db.find(query).skip(offset).limit(limit).toArray();
}

export async function batchWrite(
  connection: MongoClient,
  database: string,
  collection: string,
  docs: any[]
): Promise<void> {
  const db = connection.db(database).collection(collection);
  return await db.insertMany(docs);
}

export async function getDocumentCount(
  connection: MongoClient,
  database: string,
  collection: string,
  queryOptions?: any
): Promise<number> {
  const db = connection.db(database).collection(collection);
  return await db.countDocuments(queryOptions);
}

export async function createEntity(
  connection: MongoClient,
  database: string,
  collection: string
): Promise<void> {
  const db = connection.db(database);
  await db.createCollection(collection);
}

export async function dropEntity(
  connection: MongoClient,
  database: string,
  collection: string
): Promise<void> {
  const db = connection.db(database);
  await db.collection(collection).drop();
}