import { Config } from "../types/config";

export const config: Config = {
  db: {
    source: {
      client: 'mongodb',
      connection: 'mongodb://localhost:27017',
      database: 'test',
      collection: 'test',
    },
    destination: {
      client: 'mysql2',
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
    dryRun: false,
    rollbackOnFailure: true,
    batchSize: {
      read: 4,
      write: 2,
    },
    log: {
      level: 'info',
      // file: 'migration.log',
    },
  },

  fieldMapping: {
    mapping: {
      _id: { 
        to: "id", 
        transform: (field: any) => field.toString(),
      },
      name: { to: 'name' },
      age: { to: 'age' },
      createdAt: { to: "createdAt" }
    },
    strictMapping: true,
    // idMapping: { 
    //   // Example: { id: '_id' }
    // }, // can we achive without using idMapping
  },
  
  validation: {
    zodValidator: () => {},
    zodOptions: {},
    logFile: 'validation'
  },
};


// Make sure that default values or omitted configurations won't lead to unexpected behavior. 
// For instance, if validation or fieldMapping is omitted, ensure the migration
//  still works with sensible defaults or fails with an informative message.