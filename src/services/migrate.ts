import getDatabase from './db';
import { validateDoc } from './validate';
import { transformDoc } from './transform';
import { Config, DbClientConfig } from '../types/config';

function getEntity(dbClientConfig: DbClientConfig): string {
  if (dbClientConfig.table === undefined && dbClientConfig.collection === undefined) {
    throw new Error("Either 'table' or 'collection' must be specified.");
  }

  if (dbClientConfig.table !== undefined) {
    return dbClientConfig.table;
  }

  if (dbClientConfig.collection !== undefined) {
    return dbClientConfig.collection;
  }

  throw new Error("Unexpected state: Both 'table' and 'collection' are undefined.");
}

export default async (config: Config) => {
  const { dbConfig, migrationConfig, fieldMappingConfig, validationConfig } = config;
  const sourceDatabase = getDatabase(dbConfig.source.client);
  const destinationDatabase = getDatabase(dbConfig.destination.client);

  const connectionPromises = [
    sourceDatabase.connect(config.dbConfig.source.client, config.dbConfig.source.connection),
    destinationDatabase.connect(config.dbConfig.destination.client, config.dbConfig.destination.connection),
  ];
  const [sourceConnection, destinationConnection] = await Promise.all(connectionPromises);

  const readBatchSize = config.migrationConfig.batchSize.read;
  const writeBatchSize = config.migrationConfig.batchSize.write;
  let offset = 0;

  let documents;
  do {
    const sourceEntity = getEntity(dbConfig.source);
    documents = await sourceDatabase.batchQuery(
      sourceConnection,
      dbConfig.source.database,
      sourceEntity,
      null,
      offset,
      readBatchSize,
    );

    if (documents.length > 0) {
      // Process documents in chunks based on write batch size
      for (let i = 0; i < documents.length; i += writeBatchSize) {
        const chunk = documents.slice(i, i + writeBatchSize);

        const convertedDocuments = chunk.map((document) => {
          const convertedDocument = transformDoc(document, config.fieldMappingConfig);
          // const validationRes = validateDoc(convertedDocument, config.validationConfig);
          return convertedDocument;
        });

        const destinationEntity = getEntity(dbConfig.destination);
        const writeResult = await destinationDatabase.batchWrite(
          destinationConnection,
          dbConfig.destination.database,
          destinationEntity,
          convertedDocuments,
        );

        offset += readBatchSize;
        console.log(`Processed ${writeResult} documents in the current chunk`);
      }
    }
  } while (documents.length > 0);

  // Close database connections
  await sourceDatabase.close(sourceConnection);
  await destinationDatabase.close(destinationConnection);
};