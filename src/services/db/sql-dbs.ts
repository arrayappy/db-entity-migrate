import knex, { Knex } from 'knex';
import { DbClient, ClientName, Connection } from '../../../types';
import { dependencyMap } from '../../utils';

class KnexDatabase implements DbClient {
  private knexInstance!: Knex;

  async connect (client: ClientName, connection: Connection, database: string) {
    this.knexInstance = knex({
      client: dependencyMap[client],
      connection
    })
  }

  async close(): Promise<any> {
    await this.knexInstance.destroy();
  }

  async batchQuery(database: string, table: string, offset: number, limit: number): Promise<any[]> {
    return this.knexInstance.select('*').from(`${database}.${table}`).offset(offset).limit(limit);
  }

  async batchWrite(database: string, table: string, rows: any[]): Promise<any> {
    return await this.knexInstance.withSchema(database).table(table).insert(rows);
  }

  async getDocumentCount(database: string, table: string, queryOptions?: any): Promise<number> {
    const result = await this.knexInstance
      .from(`${database}.${table}`)
      .where(queryOptions || {})
      .count({ count: '*' });

    return parseInt(result[0]?.count, 10) || 0;
  }

  async createEntity(database: string, table: string, createTableRawSql: string): Promise<any> {
    await this.knexInstance.raw(createTableRawSql);
  }

  async dropEntity(database: string, table: string): Promise<any> {
    await this.knexInstance.schema.dropTableIfExists(`${database}.${table}`);
  }
}

export default KnexDatabase;
