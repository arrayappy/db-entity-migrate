import { Knex } from 'knex/types';
import { AnyZodObject } from 'zod';

type ClientName = "mongodb" | "firestore" | "mysql" | "postgres" | "sqlite3" | "oracledb" ;

interface FirestoreConnection {
  serviceKeyPath: string,
  databaseURL: string
}
type Connection = string | Knex.StaticConnectionConfig | FirestoreConnection;

interface DbClientInterface {
  client: ClientName,
  connection: Connection,
  database?: string,
  table?: string,
  collection?: string;
  createTableRawSql?: string,
}

interface DbInterface {
  source: DbClientInterface,
  destination: DbClientInterface
}

interface MigrationInterface {
  dryRun: boolean,
  batchSize: {
    read: number,
    write: number,
  },
  log: {
    level: 'verbose' | 'info' | 'warning' | 'error';
    filePath?: string,
  }
}

interface FieldMappingInterface {
  mapping: {
    [key: string]: {
      to: string,
      default?: any,
      allowNull?: boolean,
      transform?: (value: any) => any,
    }
  },
  idField?: string,
  strictMapping?: boolean,
}

interface ValidationInterface {
  zodValidator: AnyZodObject,
  zodParserType: 'safeParse' | 'parse'
  logPath?: string,
}

interface Config {
  db: DbInterface,
  migration: MigrationInterface,
  fieldMapping?: FieldMappingInterface,
  validation?: ValidationInterface,
}

interface DbClient {
  connect(client: ClientName, connection: Connection, database?: string): Promise<any>, 
  close(): Promise<any>;
  batchQuery(database: string | undefined, entity: string, offset: number, limit: number): Promise<any[]>;
  batchWrite(database: string | undefined, entity: string, docs: any[], idField: string | undefined): Promise<any>;
  getDocumentCount(database: string | undefined, entity: string): Promise<number>;
  createEntity(database: string | undefined, entity: string, createTableRawSql?: string): Promise<boolean>;
  dropEntity(database: string | undefined, entity: string): Promise<any>;
}