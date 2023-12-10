import * as sqlDatabase from "./sql-dbs";
import * as mongodb from "./mongodb";

type DatabaseName = "mysql" | "postgresql" |"mongodb";

interface Database {
  connect(client: string, connectionInfo: any): Promise<any>;
  close(connection: any): Promise<void>;
  batchQuery(connection: any, database: string, entity: string, query: any, offset: number, limit: number): Promise<any[]>;
  batchWrite(connection: any, database: string, entity: string, docs: any[]): Promise<void>;
}

const getDatabase = (databaseName: DatabaseName): Database => {
  let database: Database;
  switch (databaseName) {
    case 'mysql':
    case 'postgresql':
      database = sqlDatabase;
      break;
    case 'mongodb':
      database = mongodb;
      break;
    default:
      throw new Error(`Unsupported database: ${databaseName}`);
  }
  return database;
};

export default getDatabase;
