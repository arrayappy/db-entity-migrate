import { Connection } from './config';

export type DbClientName = "mysql2" | "postgresql" |"mongodb";

export interface DbClient {
  connect(client: DbClientName, connection: Connection, database: string): Promise<any>,
  close(): Promise<void>;
  batchQuery(database: string, collection: string, query: any, sort: any, offset: number, limit: number): Promise<any[]>;
  batchWrite(database: string, collection: string, docs: any[]): Promise<void>;
  getDocumentCount(database: string, collection: string, queryOptions?: any): Promise<number>;
  createEntity(database: string, collection: string, createTableRawSql?: string): Promise<void>;
  dropEntity(database: string, collection: string): Promise<void>;
}