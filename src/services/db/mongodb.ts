import { MongoClient, Db, Collection } from "mongodb";
import { DbClient, DbClientName } from '../../../types/database';
import { Connection } from '../../../types/config';

class MongoDb implements DbClient {
  private connection!: MongoClient;
  private db!: Db;
  
  // constructor(client: DbClientName, connectionInfo: Connection, database: string) {
  //   if (typeof connectionInfo === "string") {
  //     this.connection = new MongoClient(connectionInfo);
  //     this.connection.connect().then(() => {
  //       this.db = this.connection.db(database);
  //     });
  //   }
  // }
  async connect(client: DbClientName, connectionInfo: Connection, database: string): Promise<void> {
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

  async batchQuery(database: string, collection: string, query: any, sort: any, offset: number, limit: number): Promise<any[]> {
    console.log('mongo query')
    if (!this.db) {
      throw new Error('Not connected to the database');
    }
    console.log('mongo q2')

    const coll: Collection = this.db.collection(collection);
    return await coll.find({}).skip(offset).limit(limit).toArray();
  }

  async batchWrite(database: string, collection: string, docs: any[]): Promise<void> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }
    console.log('db already created')

    const coll: Collection = this.db.collection(collection);
    
    await coll.insertMany(docs);
  }

  async getDocumentCount(database: string, collection: string, queryOptions?: any): Promise<number> {
    if (!this.db) {
      throw new Error('Not connected to the database');
    }

    const coll: Collection = this.db.collection(collection);

    return await coll.countDocuments(queryOptions);
  }

  async createEntity(database: string, collection: string): Promise<void> {
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
