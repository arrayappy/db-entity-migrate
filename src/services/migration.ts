import * as dbService from './db'; // as dbService
import { validateDoc, isDocValidationExists, getEntity } from './validate';
import { transformDoc } from './transform';
import LogStream from './log-stream';
import { Config } from '../../types';
import { databasesWithKnex } from '../utils';

const writeLogs = (logStreamClient: LogStream | null, transformedDocs: any, resultsArray: any, idField: string | undefined, isFinalWrite: boolean) => {
  if (!logStreamClient || !resultsArray || resultsArray.length === 0) {
    return;
  }

  const logs = [];

  for (let i = 0; i < transformedDocs.length && i < resultsArray.length; i++) {
    const ts = new Date();
    const docId = idField ? transformedDocs[i][idField] : null;
    const result = resultsArray[i];

    if (result) {
      if (docId !== null && docId !== undefined) {
        logs.push({ ts, docId, result });
      } else {
        logs.push({ ts, result })
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

  if (!migration.dryRun) {
    if(databasesWithKnex.includes(db.destination.client)) {
      await destinationDbClient.createEntity(db.destination.database, destinationEntity, db.destination.createTableRawSql)
    }
  }

  const totalDocs = await sourceDbClient.getDocumentCount(db.source.database, sourceEntity);

  let idField = fieldMapping?.idField;

  const writeResultLogStream: LogStream | null = migration.log.filePath ? new LogStream(migration.log.filePath) : null;
  const validationLogStream: LogStream | null = (validation?.logPath && isDocValidationExists(validation)) ? new LogStream(validation.logPath) : null;

  const readBatchSize = migration.batchSize.read;
  const writeBatchSize = migration.batchSize.write;

  let writesCounter = 0;
  let offset = 0;
  let dryRunCompleted = false;
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
        writeLogs(validationLogStream, transformedDocs, validationResults, idField, isFinalWrite);
  
        if (!migration.dryRun) {
          const writeResults = await destinationDbClient.batchWrite(db.destination.database, destinationEntity, transformedDocs, idField);
          writeLogs(writeResultLogStream, transformedDocs, writeResults, idField, isFinalWrite);
          console.log(`Progress: [${writesCounter}/${totalDocs}] ${((writesCounter / totalDocs) * 100).toFixed(2)}%`);
          offset += readBatchSize;
          
        } else {
          console.log("Dry Run")
          console.log(transformedDocs)
          writeLogs(writeResultLogStream, transformedDocs, transformedDocs, idField, true);
          dryRunCompleted = true;
          break;
        }
      }
    }
  } while (docs.length > 0 && !dryRunCompleted); 
  
  const closePromises = [
    sourceDbClient.close(),
    destinationDbClient.close(),
  ];
  await Promise.all(closePromises);
};
