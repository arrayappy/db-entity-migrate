export function validateDoc(data:any, validation:any): Promise<any> {
  const { zodValidator, zodOptions } = validation;
    return zodValidator(data, zodOptions);
  }