import { z, ZodObject } from 'zod';
import { Config } from '../types/config';

const sourceConfigSchema = z.object({
  client: z.string(),
  connection: z.string(),
  database: z.string(),
  collection: z.string(),
});

const destinationConfigSchema = z.object({
  client: z.string(),
  connection: z.object({
    host: z.string(),
    port: z.number(),
    user: z.string(),
    password: z.string(),
  }),
  database: z.string(),
  table: z.string(),
  createTableRawSql: z.string(),
});

const migrationConfigSchema = z.object({
  dryRun: z.boolean(),
  rollbackOnFailure: z.boolean(),
  batchSize: z.object({
    read: z.number(),
    write: z.number(),
  }),
  log: z.object({
    level: z.string(),
  }),
});

const fieldMappingSchema = z.object({
  fieldMapping: z.record(
    z.object({
      to: z.string(),
      default: z.nullable(z.unknown()),
      allowNull: z.boolean(),
      transform: z.function(z.unknown(), z.unknown()),
    })
  ),
});

const validationConfigSchema = z.object({
  library: z.literal('zod'),
  validate: z.function(z.unknown(), z.unknown()),
  options: z.object(),
});

const configSchema: ZodObject<Config> = z.object({
  dbConfig: z.object({
    source: sourceConfigSchema,
    destination: destinationConfigSchema,
  }),
  migrationConfig: migrationConfigSchema,
  fieldMappingConfig: fieldMappingSchema,
  validationConfig: validationConfigSchema,
});

export const validateConfig = (config: Config) => {
  configSchema.parse(config);
};
