import { z } from 'zod';

export function validateDoc(data:any, validationConfig:any): Promise<any> {
  const { library, validate, options } = validationConfig;

  switch (library) {
    case 'zod':
      return validate(validate, data, options);
    default:
      throw new Error(`Validation library '${library}' not supported.`);
    }
  }