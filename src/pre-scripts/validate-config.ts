import { z } from 'zod';
import { config } from '../config';

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

const fieldMappingSchema= z.object({
  mapping: z.record(
    z.object({
      to: z.string(),
      default: z.optional(z.nullable(z.unknown())),
      allowNull: z.optional(z.boolean()),
      transform: z.optional(z.function()),
    })
  ),
});

const validationConfigSchema = z.object({
  zodValidator: z.function(),
  zodOptions: z.object({}),
  logFile: z.string()
});

const configSchema = z.object({
  db: z.object({
    source: sourceConfigSchema,
    destination: destinationConfigSchema,
  }),
  migration: migrationConfigSchema,
  fieldMapping: fieldMappingSchema,
  validation: validationConfigSchema,
});

const validateConfig = (config: any) => {
  const res = configSchema.safeParse(config);
  console.log(JSON.stringify(res)) // format this errors
}
// validateConfig(config)

export {
  validateConfig
}