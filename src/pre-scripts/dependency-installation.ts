import { spawn } from 'child_process';
import { dependencyMap, databasesWithKnex } from '../utils';

const dependencyInstalled = async (dependency: string, globalInstall: boolean): Promise<boolean> => {
  const dependencyFromMap = dependencyMap[dependency];
  const listCommand = globalInstall ? ['list', '-g', '--depth', '0', dependencyFromMap] : ['list', '--depth', '0', dependencyFromMap];
  const process = spawn('npm', listCommand);
  let result = '';

  process.stdout.on('data', (data) => {
    result += data;
  });

  return new Promise((resolve) => {
    process.on('close', (code) => {
      resolve(result.includes(dependencyFromMap));
    });
  });
};

const installDependency = async (dependency: string, globalInstall: boolean): Promise<void> => {
  const installCommand = globalInstall ? 'install -g' : 'install';
  const process = spawn('npm', [installCommand, dependencyMap[dependency]]);

  return new Promise(async (resolve, reject) => {
    process.on('close', async (code) => {
      if (code === 0) {
        resolve();
      } else {
        const errorMessage = `Error installing ${dependency} dependency. Exit code: ${code}`;
        console.error(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  });
};

const installDependencies = async (dependencyList: string[], globalInstall: boolean): Promise<void> => {
  if (dependencyList.some((dependency) => databasesWithKnex.includes(dependency))) {
    dependencyList.push('knex');
  }
  const alreadyInstalledPromises = dependencyList.map((dependency) => dependencyInstalled(dependency, globalInstall));
  const alreadyInstalledResults = await Promise.all(alreadyInstalledPromises);

  const dependenciesToInstall = dependencyList.filter((_, index) => !alreadyInstalledResults[index]);

  if (dependenciesToInstall.length > 0) {
    console.log("Installing dependencies");
    const installDependencyPromises = dependenciesToInstall.map((dependency) =>
      installDependency(dependency, globalInstall)
    );
    await Promise.all(installDependencyPromises);
  }
  console.log("Dependencies installed");
};

export { installDependencies };
