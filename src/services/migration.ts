import * as dbServcie from './db'; // as dbService
import { validateDoc } from './validate';
import { transformDoc } from './transform';
// import LogStream from './log-stream';
import { Config, DbClientConfig } from '../../types/config';

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
  const { db, migration, fieldMapping, validation } = config;
  const sourceDbClient = dbServcie.getDatabase(db.source.client);
  const destinationDbClient = dbServcie.getDatabase(db.destination.client);

  
  const connectionPromises = [
    sourceDbClient.connect(db.source.client, db.source.connection, db.source.database),
    destinationDbClient.connect(db.destination.client, db.destination.connection, db.destination.database),
  ];
  await Promise.all(connectionPromises);
  console.log('s1');

  // let validationLogStream: LogStream | null = validation.logFile ? new LogStream(validation.logFile) : null;
  // let genericLogStream: LogStream | null = migration.log.logFile ? new LogStream(migration.log.logFile) : null;

  const readBatchSize = migration.batchSize.read;
  const writeBatchSize = migration.batchSize.write;
  let offset = 0;

  let docs;
  do {
    const sourceEntity = getEntity(db.source);
    docs = await sourceDbClient.batchQuery(db.source.database, sourceEntity, null, null, offset, readBatchSize);

    if (docs.length > 0) {
      for (let i = 0; i < docs.length; i += writeBatchSize) {
        const chunk = docs.slice(i, i + writeBatchSize);
        console.log(chunk)

        const transformedDocs = chunk.map((document) => {
          const transformedDoc = transformDoc(document, fieldMapping);
          
          // Log validation logs if validationLogStream is available
          // const validationRes = validateDoc(transformedDoc, validation);
          // if (validationLogStream) {
          //   validationLogStream.write(validationRes);
          // }

          // Log response logs if genericLogStream is available
          // if (genericLogStream) {
          //   genericLogStream.write(transformedDoc);
          // }

          return transformedDoc;
        });

        const destinationEntity = getEntity(db.destination);
        const writeResult = await destinationDbClient.batchWrite(
          db.destination.database,
          destinationEntity,
          transformedDocs,
        );

        offset += readBatchSize;
        console.log(`Processed ${writeResult} docs in the current chunk`);
      }
    }
  } while (docs.length > 0);

  // End the log streams if they were created
  // if (validationLogStream) {
  //   validationLogStream.end();
  // }

  // if (genericLogStream) {
  //   genericLogStream.end();
  // }

  const closePromises = [
    sourceDbClient.close(),
    destinationDbClient.close(),
  ];
  await Promise.all(closePromises);
};
