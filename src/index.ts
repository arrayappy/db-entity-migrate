import { installDependencies } from './pre-scripts/dependency-installation';
import { isValidConfig } from './pre-scripts/validate-config'
import migration from './services/migration';
import { Config } from '../types';

const migrate = async (config: Config) => {
  if (isValidConfig(config)) {
    // await installDependencies([config.db.source.client, config.db.destination.client], false);
    const timeMessage = `Total migration time: `;
    console.time(timeMessage);
    await migration(config);
    console.timeEnd(timeMessage);
  }
}

export {
  migrate,
};
