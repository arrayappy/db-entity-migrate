import { ValidationInterface, DbClientInterface } from '../../types'

const isDocValidationExists = (validation: ValidationInterface): boolean => {
  const { zodValidator } = validation || {};
  if (zodValidator) {
    // Use safeParse to validate an empty object
    return !zodValidator.safeParse({}).success;
  }
  return false;
};

const validateDoc = (validation: ValidationInterface, doc: any): any => {
  const { zodValidator, zodParserType } = validation;
  if (zodParserType === "parse") {
    zodValidator.parse(doc);
  } else if (zodParserType === "safeParse") {
    const response = zodValidator.safeParse(doc);
    if (!response.success) {
      return response.error.issues;
    } else {
      return null;
    }
  }
}

const getEntity = (dbClientConfig: DbClientInterface): string => {
  const { table, collection } = dbClientConfig;
  
  if (table !== undefined && collection !== undefined) {
    throw new Error("Unexpected state: Both 'table' and 'collection' are defined.");
  }

  if (table !== undefined) return table;

  if (collection !== undefined) return collection;

  throw new Error("Either 'table' or 'collection' must be specified.");
};

export {
  isDocValidationExists,
  validateDoc,
  getEntity
}