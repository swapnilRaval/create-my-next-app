'use strict';

const pc = require('picocolors');

function ok(message) {
  process.stdout.write(`${pc.green('✔')} ${message}\n`);
}

function info(message) {
  process.stdout.write(`${pc.cyan('ℹ')} ${message}\n`);
}

function warn(message) {
  process.stdout.write(`${pc.yellow('⚠')} ${message}\n`);
}

function error(message) {
  process.stderr.write(`${pc.red('✖')} ${message}\n`);
}

function blank() {
  process.stdout.write('\n');
}

module.exports = { ok, info, warn, error, blank };
