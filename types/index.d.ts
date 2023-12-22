import { Knex } from 'knex/types';
import { AnyZodObject } from 'zod';

type Connection = string | Knex.StaticConnectionConfig;
type ClientName = "mysql" | "postgresql" |"mongodb";

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
  strictMapping?: boolean,
  idMapping?: { [key: string]: string };
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
  connect(client: ClientName, connection: Connection, database?: string): Promise<any>, // todo complete
  close(): Promise<any>;
  batchQuery(database: string | undefined, entity: string, offset: number, limit: number): Promise<any[]>;
  batchWrite(database: string | undefined, entity: string, docs: any[]): Promise<any>;
  getDocumentCount(database: string | undefined, entity: string): Promise<number>;
  createEntity(database: string, entity: string, createTableRawSql?: string): Promise<boolean>;
  dropEntity(database: string, entity: string): Promise<any>;
}