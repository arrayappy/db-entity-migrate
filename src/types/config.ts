interface Connection {
  host: string,
  port: number,
  user: string,
  password: string,
  database?: string,
}

interface DbClientConfig {
  client: 'mysql' | 'postgresql' | 'mongodb',
  connection: string | Connection,
  database: string,
  table?: string,
  collection?: string;
  query?: {[key: string]: string| number} | string,
  sort?: any,
  createTableRawSql?: string,
};

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
  fieldMapping: {
    [key: string]: {
      to: string,
      default?: any,
      allowNull?: boolean,
      transform?: () => void,
    }
  },
  strictMapping?: boolean,
  idMapping?: { [key: string]: string };
}

interface ValidationConfig {
  library: "zod",
  validate: () => any,
  options?: any,
  validationLogFile?: string,
}

interface Config {
  dbConfig: DbConfig,
  migrationConfig: MigrationConfig,
  fieldMappingConfig: FieldMappingConfig,
  validationConfig: ValidationConfig,
}

export {
  Connection,
  DbClientConfig,
  DbConfig,
  MigrationConfig,
  FieldMappingConfig,
  ValidationConfig,
  Config
}