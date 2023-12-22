import KnexDatabase from "./sql-dbs";
import MongoDb from "./mongodb";

import { DbClient, ClientName } from '../../../types';

const getDatabase = (client: ClientName): DbClient => {
  switch (client) {
    case 'mysql':
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
