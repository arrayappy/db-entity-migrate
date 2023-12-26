import { z } from 'zod';
import { Config } from '../../types';

const nullableOptional = (value: any) => z.nullable(z.optional(value));

const dbConfigSchema = z.object({
  client: z.enum(["mongodb", "firestore", "mysql", "postgres", "sqlite3", "oracledb"]),
  database: z.optional(z.string()),
  connection: z.optional(z.any()),
  table: z.optional(z.string()),
  collection: z.optional(z.string()),
  createTableRawSql: nullableOptional(z.string()),
});

const migrationConfigSchema = z.object({
  dryRun: z.boolean(),
  batchSize: z.object({
    read: z.number(),
    write: z.number(),
  }),
  log: z.object({
    level: z.string(),
    filePath: nullableOptional(z.string())
  }),
});

const fieldMappingSchema= nullableOptional(z.object({
  mapping: nullableOptional(z.record(
    z.object({
      to: z.string(),
      default: nullableOptional(z.unknown()),
      allowNull: z.optional(z.boolean()),
      transform: z.optional(z.function()),
    })
  )),
  strictMapping: z.optional(z.boolean()),
  idMapping: z.optional(z.string())
}));

const validationConfigSchema = nullableOptional(z.object({
  zodValidator: nullableOptional(z.object({})),
  zodParserType: z.enum(['safeParse', 'parse']),
  logFile: nullableOptional(z.string())
}));

const configSchema = z.object({
  db: z.object({
    source: dbConfigSchema,
    destination: dbConfigSchema,
  }),
  migration: migrationConfigSchema,
  fieldMapping: fieldMappingSchema,
  validation: validationConfigSchema,
});

const isValidConfig = (config: Config): boolean => {
  const result = configSchema.safeParse(config);

  if (!result.success) {
    result.error.issues.forEach((issue: any) => {
      const path = issue.path.join('.');
      console.error(`Error in config at ${path}: ${issue.message}`);
    });
    console.error('Please fix the config file and run the program again!');
    return false;
  }

  if(config.migration?.batchSize?.read < config.migration?.batchSize?.write) {
    console.error("Batch write size must be less than read size");
    return false;
  }

  return true;
};

export {
  isValidConfig
}