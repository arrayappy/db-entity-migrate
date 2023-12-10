import _ from 'lodash';

export function transformDoc(source: any, fieldMappingConfig: any): Promise<any> {
  const { fieldMapping, strictMapping } = fieldMappingConfig;
  const destination = strictMapping ? {} : _.cloneDeep(source);

  for (const sourceKey in fieldMapping) {
    const mapping = fieldMapping[sourceKey];
    const destinationKey = mapping.to;
    const defaultValue = mapping.default;
    const allowNull = mapping.allowNull;
    const transform = mapping.transform;

    const sourceValue = _.get(source, sourceKey);

    const valueToTransform = typeof sourceValue !== 'undefined' ? sourceValue : defaultValue;

    if (!allowNull && (valueToTransform === null || valueToTransform === undefined)) {
      throw new Error(`Value for field '${sourceKey}' cannot be null or undefined.`);
    }

    const transformedValue = typeof transform === 'function' ? transform(valueToTransform) : valueToTransform;

    _.set(destination, destinationKey, transformedValue);
  }

  return destination;
}