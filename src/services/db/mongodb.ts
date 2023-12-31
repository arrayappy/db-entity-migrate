import { MongoClient, Db, Collection } from "mongodb";
import { DbClient, ClientName } from '../../../types';

class MongoDb implements DbClient {
  private connection!: MongoClient;
  private db!: Db;
  
  async connect(client: ClientName, connectionInfo: string, database: string): Promise<void> {
    if (typeof connectionInfo === "string") {
      this.connection = new MongoClient(connectionInfo);
      await this.connection.connect();
      this.db = this.connection.db(database);
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
    }
  }

  async batchQuery(database: string, collection: string, offset: number, limit: number): Promise<any[]> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    const coll: Collection = this.db.collection(collection);
    return await coll.find({}).skip(offset).limit(limit).toArray();
  }

  async batchWrite(database: string, collection: string, docs: any[], idField: string | undefined): Promise<any> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }
  
    if (idField) {
      docs = docs.map((doc) => {
        if (doc.hasOwnProperty(idField)) {
          return { ...doc, _id: doc[idField] }; 
        }
        return doc;
      });
    }
  
    const coll = this.db.collection(collection);
    return await coll.insertMany(docs);
  }
  
  async getDocumentCount(database: string, collection: string): Promise<number> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    const coll: Collection = this.db.collection(collection);

    return await coll.countDocuments({});
  }

  async createEntity(database: string, collection: string): Promise<any> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    await this.db.createCollection(collection);
  }

  async dropEntity(database: string, collection: string): Promise<void> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    await this.db.collection(collection).drop();
  }
}

export default MongoDb;
