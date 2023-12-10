import { spawn } from 'child_process';
import { promisify } from 'util';
import { dependencyMap, databasesWithKnex } from '../configs/index';

const spawnAsync = promisify(spawn);

const dependencyInstalled = async (dependency: string, globalInstall: boolean): Promise<boolean> => {
  const listCommand = globalInstall ? ['list', '-g', '--depth', '0', dependency] : ['list', '--depth', '0', dependency];
  const process = spawn('npm', listCommand);
  let result = '';

  process.stdout.on('data', (data) => {
    result += data;
  });

  return new Promise((resolve) => {
    process.on('close', (code) => {
      resolve(result.includes(dependency));
    });
  });
};

const installDependency = async (dependency: string, globalInstall: boolean): Promise<void> => {
  const alreadyInstalled = await dependencyInstalled(dependency, globalInstall);

  if (!alreadyInstalled) {
    const installCommand = globalInstall ? 'install -g' : 'install';
    const process = spawn('npm', [installCommand, dependency]);

    return new Promise(async (resolve, reject) => {
      process.on('close', async (code) => {
        if (code === 0) {
          console.log("Successfully installed", dependency, await dependencyInstalled(dependency, globalInstall));
          resolve();
        } else {
          const errorMessage = `Error installing ${dependency} dependency. Exit code: ${code}`;
          console.error(errorMessage);
          reject(new Error(errorMessage));
        }
      });
    });
  } else {
    return Promise.resolve();
  }
};

const installDependencies = async (dependencyList: string[], globalInstall: boolean): Promise<void> => {
  if (dependencyList.some((dependency) => databasesWithKnex.includes(dependency))) {
    dependencyList.push('knex');
  }

  const alreadyInstalledPromises = dependencyList.map((dependency) => dependencyInstalled(dependency, globalInstall));
  const alreadyInstalledResults = await Promise.all(alreadyInstalledPromises);

  console.log({alreadyInstalledResults})
  // If any library is not installed, then only move forward with installations
  if (!alreadyInstalledResults.every(Boolean)) {
    const installDependencyPromises = dependencyList.map((dependency) => installDependency(dependencyMap[dependency], globalInstall));
    await Promise.all(installDependencyPromises);
  }
};

export { installDependencies };
