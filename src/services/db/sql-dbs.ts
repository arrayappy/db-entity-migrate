import knex, { Knex } from 'knex';
import { DbClient, DbClientName } from '../../../types/database';
import { Connection } from '../../../types/config';

class KnexDatabase implements DbClient {
  private knexInstance!: Knex;

  // constructor(client: DbClientName, connection: Connection, database: string) {
  //   this.knexInstance = knex({
  //     client,
  //     connection
  //   });
  // }

  async connect (client: DbClientName, connection: Connection, database: string) {
    this.knexInstance = knex({
      client,
      connection
    })
  }

  async close(): Promise<void> {
    await this.knexInstance.destroy();
  }

  async batchQuery(database: string, table: string, query: any, sort: any, offset: number, limit: number): Promise<any[]> {
    return this.knexInstance.select('*').from(`${database}.${table}`).offset(offset).limit(limit);
  }

  async batchWrite(database: string, table: string, rows: any[]): Promise<void> {
    console.log({rows})
    await this.knexInstance.withSchema(database).table(table).insert(rows);
  }

  async getDocumentCount(database: string, table: string, queryOptions?: any): Promise<number> {
    const result = await this.knexInstance
      .from(`${database}.${table}`)
      .where(queryOptions || {})
      .count({ count: '*' });

    return parseInt(result[0]?.count, 10) || 0;
  }

  async createEntity(database: string, table: string, createTableRawSql: string): Promise<void> {
    await this.knexInstance.raw(createTableRawSql);
  }

  async dropEntity(database: string, table: string): Promise<void> {
    await this.knexInstance.schema.dropTableIfExists(`${database}.${table}`);
  }
}

export default KnexDatabase;
