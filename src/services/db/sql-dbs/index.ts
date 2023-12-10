import Knex from 'knex';

// Get types for connectionInfo
export async function connect(client: string, connectionInfo: any): Promise<any> {
  const knexInstance = Knex({
    client: client,
    connection: connectionInfo,
  });
  return knexInstance;
}

export async function close(knexInstance: any): Promise<void> {
  await knexInstance.destroy();
}

export async function batchQuery(
  knexInstance: any,
  database: string,
  query: any,
  table: string,
  offset: number,
  limit: number
): Promise<any[]> {
  return knexInstance.select('*').from(`${database}.${table}`).offset(offset).limit(limit);
}

export async function batchWrite(
  knexInstance: any,
  database: string,
  table: string,
  rows: any[]
): Promise<void> {
  await knexInstance(table).insert(rows);
}

export async function getDocCount(
  knexInstance: Knex,
  database: string,
  table: string,
  queryOptions?: any
): Promise<number> {
  const result = await knexInstance
    .from(`${database}.${table}`)
    .where(queryOptions || {})
    .count({ count: '*' });
  return parseInt(result[0]?.count, 10) || 0;
}

export async function createDatabase(knexInstance: Knex, database: string): Promise<void> {
  await knexInstance.schema.createDatabase(database);
}

export async function createEntity(
  knexInstance: Knex,
  database: string,
  table: string,
  createTableRawSql: string
): Promise<void> {
  await knexInstance.raw(createTableRawSql);
}

export async function dropEntity(
  knexInstance: Knex,
  database: string,
  table: string
): Promise<void> {
  await knexInstance.schema.dropTableIfExists(`${database}.${table}`);
}