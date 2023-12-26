import knex, { Knex } from 'knex';
import { DbClient, ClientName } from '../../../types';
import { dependencyMap } from '../../utils';

class KnexDatabase implements DbClient {
  private knexInstance!: Knex;

  async connect (client: ClientName, connection: Knex.StaticConnectionConfig, database: string) {
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

  async batchWrite(database: string, table: string, rows: any[], idField: string | undefined): Promise<any> {
    return await this.knexInstance.withSchema(database).table(table).insert(rows);
  }

  async getDocumentCount(database: string, table: string): Promise<number> {
    const result = await this.knexInstance
      .from(`${database}.${table}`)
      .where({})
      .count({ count: '*' });

    return parseInt(result[0]?.count, 10) || 0;
  }

  async createEntity(database: string, table: string, createTableRawSql: string): Promise<any> {
    return this.knexInstance.transaction(async (trx) => {
      await trx.raw(`CREATE DATABASE IF NOT EXISTS ${database}`);
      await trx.raw(`USE ${database}`);
      await trx.raw(createTableRawSql);
    });
  }

  async dropEntity(database: string, table: string): Promise<any> {
    await this.knexInstance.schema.dropTableIfExists(`${database}.${table}`);
  }
}

export default KnexDatabase;
