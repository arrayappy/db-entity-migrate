import KnexDatabase from "./sql-dbs";
import MongoDb from "./mongodb";

import { DbClient, ClientName } from '../../../types';
import FirestoreDb from "./firestore";

const getDatabase = (client: ClientName): DbClient => {
  switch (client) {
    case 'mysql':
    case 'postgres':
    case 'sqlite3':
    case 'oracledb':
      return new KnexDatabase();
    case 'mongodb':
      return new MongoDb();
    case 'firestore':
      return new FirestoreDb();
    default:
      throw new Error(`Unsupported database: ${client}`);
  }
};

export {
  getDatabase
};
