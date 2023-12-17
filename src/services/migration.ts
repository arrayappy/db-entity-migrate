import * as dbService from './db'; // as dbService
import { validateDoc, isDocValidationExists, getEntity } from './validate';
import { transformDoc } from './transform';
import LogStream from './log-stream';
import { Config } from '../../types';

const writeLogs = (logStreamClient: LogStream | null, transformedDocs: any, resultsArray: any, docIdField: string | undefined, isFinalWrite: boolean) => {
  if (!logStreamClient) return;

  const logs = [];

  for (let i = 0; i < transformedDocs.length && i < resultsArray.length; i++) {
    const ts = new Date();
    const docId = docIdField ? transformedDocs[i][docIdField] : null;
    const result = resultsArray[i];

    if (result) {
      if (docId !== null && docId !== undefined) {
        logs.push({ ts, docId, result });
      } else {
        logs.push({ ts, docId })
      }
    }
  }
  if(!isFinalWrite) {
    logStreamClient.writeArray(logs);
  } else {
    logStreamClient.finalizeWithArray(logs);
  }
}
export default async (config: Config) => {
  const { db, migration, fieldMapping, validation } = config;

  const sourceDbClient = dbService.getDatabase(db.source.client);
  const destinationDbClient = dbService.getDatabase(db.destination.client);

  const connectionPromises = [
    sourceDbClient.connect(db.source.client, db.source.connection, db.source.database),
    destinationDbClient.connect(db.destination.client, db.destination.connection, db.destination.database),
  ];
  await Promise.all(connectionPromises);

  const sourceEntity = getEntity(db.source);
  const destinationEntity = getEntity(db.destination);

  const totalDocs = await sourceDbClient.getDocumentCount(db.source.database, sourceEntity);

  let docIdField = fieldMapping?.idMapping?.[Object.keys(fieldMapping.idMapping)[0]];

  const writeResultLogStream: LogStream | null = migration.log.filePath ? new LogStream(migration.log.filePath) : null;
  const validationLogStream: LogStream | null = (validation?.logPath && isDocValidationExists(validation)) ? new LogStream(validation.logPath) : null;

  const readBatchSize = migration.batchSize.read;
  const writeBatchSize = migration.batchSize.write;

  let writesCounter = 0;
  let offset = 0;
  let docs;
  do {
    docs = await sourceDbClient.batchQuery(db.source.database, sourceEntity, offset, readBatchSize);

    if (docs.length > 0) {
      for (let i = 0; i < docs.length; i += writeBatchSize) {
        const chunk = docs.slice(i, i + writeBatchSize);
        writesCounter += chunk.length;
        const isFinalWrite = writesCounter >= totalDocs;

        const transformedDocs = chunk.map((document: any) => (fieldMapping ? transformDoc(document, fieldMapping, db.destination.client) : document));

        const validationResults = transformedDocs.map((document: any) => validateDoc(document, validation));
        writeLogs(validationLogStream, transformedDocs, validationResults, docIdField, isFinalWrite);

        const writeResults = await destinationDbClient.batchWrite(db.destination.database, destinationEntity, transformedDocs);
        writeLogs(writeResultLogStream, transformedDocs, writeResults, docIdField, isFinalWrite);

        console.log(`Progress: [${writesCounter}/${totalDocs}] ${((writesCounter / totalDocs) * 100).toFixed(2)}%`);
        offset += readBatchSize;
      }
    }
  } while (docs.length > 0);

  const closePromises = [
    sourceDbClient.close(),
    destinationDbClient.close(),
  ];
  await Promise.all(closePromises);
};
