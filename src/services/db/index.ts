import KnexDatabase from "./sql-dbs";
import MongoDb from "./mongodb";

import { DbClient, DbClientName } from '../../../types/database';

const getDatabase = (client: DbClientName): DbClient => {
  switch (client) {
    case 'mysql2':
    case 'postgresql':
      return new KnexDatabase();
    case 'mongodb':
      return new MongoDb();
    default:
      throw new Error(`Unsupported database: ${client}`);
  }
};

export {
  getDatabase
};
