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
      createTableRawSql: `CREATE TABLE test2 (
        id VARCHAR(24) NOT NULL PRIMARY KEY,
        name VARCHAR(255),
        age INT,
        createdAt TIMESTAMP
      );`,
    },
  },

  migration: {
    log: {
      level: 'info',
      filePath: 'migration/migration_log.json',
    },
    batchSize: {
      read: 500,
      write: 500,
    },
    dryRun: true,
  },

  fieldMapping: {
    mapping: {
      _id: { 
        to: "id",
        transform: (o) => o._id.toString()
      },
      name: { 
        to: 'name',
        allowNull: false,
        default: ''
      },
      age: { to: 'age' },
      createdAt: { to: "createdAt" }
    },
    idField: 'id',
    strictMapping: true,
  },
  
  validation: {
    zodValidator: z.object({}),
    zodParserType: 'safeParse',
    logPath: 'migration/validation_log.json'
  },
};
