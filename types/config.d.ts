interface ConnectionBase {
  host: string,
  port: number,
  user: string,
  password: string,
  database?: string,
}

type Connection = ConnectionBase | string;

interface DbClientConfig {
  client: 'mysql2' | 'postgresql' | 'mongodb',
  connection: string | Connection,
  database: string,
  table?: string,
  collection?: string;
  query?: { [key: string]: string| number },
  sort?: { [key: string]: string | number },
  createTableRawSql?: string,
}

interface DbConfig {
  source: DbClientConfig,
  destination: DbClientConfig
}

interface MigrationConfig {
  dryRun: boolean,
  rollbackOnFailure: boolean,
  batchSize: {
    read: number,
    write: number,
  },
  log: {
    level: 'verbose' | 'info' | 'warning' | 'error';
    logFile?: string,
  }
}

interface FieldMappingConfig {
  mapping: {
    [key: string]: {
      to: string,
      default?: any,
      allowNull?: boolean,
      transform?: (field:any) => any,
    }
  },
  strictMapping?: boolean,
  idMapping?: { [key: string]: string };
}

interface ValidationConfig {
  zodValidator: () => any,
  zodOptions?: any,
  logFile?: string,
}

export interface Config {
  db: DbConfig,
  migration: MigrationConfig,
  fieldMapping: FieldMappingConfig,
  validation: ValidationConfig,
}
