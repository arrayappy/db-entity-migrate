import { installDependencies } from './pre-scripts/dependency-installation';
import { validateConfig } from './pre-scripts/validate-config'
import migration from './services/migration';
import { Config } from '../types/config';

const migrate = async (config: Config, globalInstall = false) => {
  validateConfig(config);
  await installDependencies([config.db.source.client, config.db.destination.client], globalInstall);
  await migration(config);
}

// migration(config).then(() => console.log('end')).catch((e) => console.error(e))

export {
  migrate,
};
