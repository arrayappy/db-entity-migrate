import { Config } from './types/config';

export const config: Config = {
  dbConfig: {
    source: {
      client: 'mongodb',
      connection: 'mongodb+srv://stag_admin:kasdjfl@staging.a8em8.mongodb.net/?retryWrites=true&w=majority',
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
      database: 'sf_prod',
      table: 'analytics_event',
      createTableRawSql: "CREATE TABLE tm (id INT, name VARCHAR(255));",
    },
  },

  migrationConfig: {
    dryRun: false,
    rollbackOnFailure: true,
    batchSize: {
      read: 1000,
      write: 500,
    },
    log: {
      level: 'info',
      // file: 'migration.log',
    },
  },

  fieldMappingConfig: {
    fieldMapping: {
      id: {
        to: 'userId',
        default: null,
        allowNull: true,
        transform: () => {},
      },
      name: { to: 'fullName' },
      age: { to: 'userAge' },
    },
    // strictMapping: false,
    // idMapping: { 
    //   // Example: { id: '_id' }
    // }, // can we achive without using idMapping
  },
  
  validationConfig: {
    library: "zod",
    validate: () => {},
    options: {}
  },
};


// Make sure that default values or omitted configurations won't lead to unexpected behavior. 
// For instance, if validationConfig or fieldMappingConfig is omitted, ensure the migration
//  still works with sensible defaults or fails with an informative message.