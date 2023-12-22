import { FieldMappingInterface } from '../../types'
import { databasesWithKnex } from '../utils'
import _ from 'lodash';
// import get from 'lodash/get';
// import set from 'lodash/set';
// import cloneDeep from 'lodash/cloneDeep';

export function transformDoc(source: any, fieldMapping: FieldMappingInterface, destinationDatabase: string): any {
  const { mapping, strictMapping } = fieldMapping;
  const destination = databasesWithKnex.includes(destinationDatabase) || strictMapping ? {} : _.cloneDeep(source);

  for (const sourceKey in mapping) {
    const mappingValue = mapping[sourceKey];
    const destinationKey = mappingValue.to;
    const defaultValue = mappingValue.default;
    const allowNull = mappingValue.allowNull;
    const transform = mappingValue.transform;

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