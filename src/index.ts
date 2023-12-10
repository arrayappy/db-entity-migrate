import { installDependencies } from './pre-scripts/dependency-installation';
import migrate from './services/migrate';
import { Config } from './types/config';
import { config } from "./config"
import { validateConfig } from './utils/validate-config'

const migration = async (config: Config, globalInstall = false) => {
  validateConfig(config);
  await installDependencies([config.dbConfig.source.client, config.dbConfig.destination.client], globalInstall);
  await migrate(config);
}

migration(config).then(() => console.log('end')).catch((e) => console.error(e))

export {
  migration,
};
