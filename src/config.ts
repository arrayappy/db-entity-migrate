import { Config } from "../types";
import { z } from 'zod';

export const config: Config = {
  db: {
    source: {
      client: 'mongodb',
      connection: 'mongodb://localhost:27017',
      database: 'test',
      collection: 'test',
    },
    destination: {
      client: 'mysql',
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'rootroot',
      },
      database: 'test',
      table: 'test',
      createTableRawSql: "CREATE TABLE tm (id INT, name VARCHAR(255));",
    },
  },

  migration: {
    log: {
      level: 'info',
      filePath: 'dbResult.json',
    },
    batchSize: {
      read: 4,
      write: 2,
    },
    dryRun: false,
  },

  fieldMapping: {
    mapping: {
      _id: { 
        to: "id", 
        transform: (value: any) => value.toString(),
      },
      name: { to: 'name' },
      age: { to: 'age' },
      createdAt: { to: "createdAt" }
    },
    strictMapping: true,
    idMapping: {
      id: '_id' // null for mongo if they want system id, example mongo
    },
  },
  
  validation: {
    zodValidator: z.object({}),
    zodParserType: 'safeParse',
    logPath: 'validation.json'
  },
};
