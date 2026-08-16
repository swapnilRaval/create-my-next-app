'use strict';

const spawn = require('cross-spawn');
const { CliError } = require('./errors');
const { SUPPORTED_PACKAGE_MANAGERS } = require('./constants');

function resolvePackageManagerFlag(flags = {}) {
  if (flags.useNpm) return 'npm';
  if (flags.usePnpm) return 'pnpm';
  if (flags.useYarn) return 'yarn';
  return flags.packageManager;
}

function detectPackageManager(explicit) {
  if (explicit) {
    const name = String(explicit).trim().toLowerCase();
    if (!SUPPORTED_PACKAGE_MANAGERS.includes(name)) {
      throw new CliError(`Unsupported package manager "${explicit}". Use npm, yarn, or pnpm.`);
    }
    return name;
  }

  const userAgent = process.env.npm_config_user_agent || '';
  if (userAgent.startsWith('yarn/')) return 'yarn';
  if (userAgent.startsWith('pnpm/')) return 'pnpm';
  if (userAgent.startsWith('npm/')) return 'npm';

  return 'npm';
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      env: process.env,
      windowsHide: true,
    });

    child.on('error', (error) => {
      reject(new CliError(`Failed to start ${command}: ${error.message}`));
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new CliError(`${command} ${args.join(' ')} failed with exit code ${code}`));
    });
  });
}

async function installDependencies(targetDir, packageManager) {
  await runCommand(packageManager, ['install'], targetDir);
}

module.exports = {
  resolvePackageManagerFlag,
  detectPackageManager,
  installDependencies,
  runCommand,
};
