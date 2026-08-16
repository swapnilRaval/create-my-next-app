'use strict';

const path = require('path');
const validateNpmPackageName = require('validate-npm-package-name');
const { CliError } = require('./errors');

function sanitizePackageName(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9.~_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toAppTitle(packageName) {
  return packageName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function validateProjectName(input) {
  if (input == null || String(input).trim() === '') {
    throw new CliError('Project name is required. Example: npx create-my-next-app my-project');
  }

  const raw = String(input).trim();

  if (raw === '.' || raw === './') {
    const packageName = sanitizePackageName(path.basename(process.cwd()));
    assertValidPackageName(packageName, packageName);
    return {
      inPlace: true,
      targetDir: process.cwd(),
      directoryName: path.basename(process.cwd()),
      packageName,
      appTitle: toAppTitle(packageName),
    };
  }

  if (path.isAbsolute(raw)) {
    throw new CliError('Use a relative directory name, not an absolute path.');
  }

  const normalized = path.normalize(raw);
  if (normalized.split(path.sep).includes('..')) {
    throw new CliError('Project path cannot contain ".." segments.');
  }

  const directoryName = normalized;
  const packageName = sanitizePackageName(path.basename(normalized));
  assertValidPackageName(packageName, raw);

  return {
    inPlace: false,
    targetDir: path.resolve(process.cwd(), directoryName),
    directoryName,
    packageName,
    appTitle: toAppTitle(packageName),
  };
}

function assertValidPackageName(packageName, original) {
  if (!packageName) {
    throw new CliError(`"${original}" is not a valid project name.`);
  }

  const result = validateNpmPackageName(packageName);
  if (!result.validForNewPackages) {
    const details = [...(result.errors || []), ...(result.warnings || [])].join('; ');
    throw new CliError(`Invalid project name "${original}": ${details || 'does not meet npm naming rules'}`);
  }
}

module.exports = {
  sanitizePackageName,
  toAppTitle,
  validateProjectName,
};
