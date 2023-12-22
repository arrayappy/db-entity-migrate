# db-entity-migrate

## Overview

`db-entity-migrate` is a cross database migration library that supports seamless data migration between different databases supporting both sql and nosql databases.

## Features

- **Database Support**: PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, and MongoDB.

- **Project Support**: Works wit TypeScript and Javascript (ESM & CommonJs).

- **Batch Processing**: Efficiently handle large datasets by migrating data in configurable batches.

- **Field Mapping**: Define custom mappings for fields, including transformations and default values.

- **Validation with Zod**: Validate migrated data using Zod schemas with customizable logging options.

- **User-Level Configurations**: Configure migrations at both the project level and user level using TypeScript.
  
- **Robust Logging**: Provides options for logging database results and schema validations.
  
- **Dry Run**: Review migration before starting migration.

## Installation

```bash
npm install db-entity-migrate
```

## Usage
### Project Level (JavaScript/TypeScript)
- Import the migrate method.

- Pass the configuration to the migrate method.

- Run your migration script.

```
const { migrate } = require('db-entity-migrate');
const config = require('./path-to-your-config-file');

migrate(config);
```


## Configuration - Follow Example

### Sample Config

```
// config.ts

import { Config } from "db-entity-migrate";
import { z } from 'zod';

export const config: Config = {
  // Database configurations
  db: {
    source: {
      // Source database details
      client: 'mongodb',
      connection: 'mongodb://localhost:27017',
      database: 'source_database',
      collection: 'source_collection',
    },
    destination: {
      // Destination database details
      client: 'mysql',
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'rootroot',
      },
      database: 'destination_database',
      table: 'destination_table',
      createTableRawSql: "CREATE TABLE destination_table (id INT, name VARCHAR(255));",
    },
  },

  // Migration configurations
  migration: {
    log: {
      // Logging configurations
      level: 'info',
      filePath: 'migration_log.json',
    },
    batchSize: {
      // Batch processing configurations
      read: 4,
      write: 2,
    },
    dryRun: false, // Set to true for a dry run without actual writes
  },

  // Field mapping configurations
  fieldMapping: {
    mapping: {
      // Custom field mappings
      _id: { 
        to: "id", 
        transform: (o: any) => o.id.toString(),
      },
      name: { to: 'name' },
      age: { to: 'age' },
      createdAt: { to: "created_at" }, // Example: Snake case conversion
    },
    strictMapping: true, // Set to false to allow unmapped fields
    idMapping: {
      id: '_id', // null for MongoDB if they want the system ID
    },
  },
  
  // Validation configurations
  validation: {
    zodValidator: z.object({}), // Zod schema for validation (customize as needed)
    zodParserType: 'safeParse', // Zod parser type (options: 'parse', 'safeParse')
    logPath: 'validation_log.json', // Validation log file path
  },
};
```

### Contributing
Contributions are welcome! Feel free to open issues or pull requests.