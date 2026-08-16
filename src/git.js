'use strict';

const { runCommand } = require('./package-manager');
const log = require('./logger');

async function initializeGit(targetDir) {
  try {
    await runCommand('git', ['init'], targetDir);
    await runCommand('git', ['add', '.'], targetDir);
    await runCommand('git', ['commit', '-m', 'Initial commit from create-my-next-app'], targetDir);
    return true;
  } catch (error) {
    log.warn(`Git initialization skipped: ${error.message}`);
    return false;
  }
}

module.exports = { initializeGit };
