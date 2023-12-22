import { installDependencies } from './pre-scripts/dependency-installation';
import { isValidConfig } from './pre-scripts/validate-config'
import migration from './services/migration';
import { Config } from '../types';
import {config} from './config'

const migrate = async (config: Config) => {
  if (isValidConfig(config)) {
    await installDependencies([config.db.source.client, config.db.destination.client], false);
    await migration(config);
  }
}

migration(config).then(() => console.log('end')).catch((e) => console.error(e))

export {
  migrate,
};
