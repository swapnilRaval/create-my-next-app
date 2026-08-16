'use strict';

const fs = require('fs/promises');
const path = require('path');
const { CliError } = require('./errors');
const { isBinaryFile, renderTextTemplate, toOutputRelativePath } = require('./template-utils');

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function isNonEmptyDirectory(targetPath) {
  if (!(await pathExists(targetPath))) {
    return false;
  }

  const stats = await fs.stat(targetPath);
  if (!stats.isDirectory()) {
    throw new CliError(`"${targetPath}" exists and is not a directory.`);
  }

  const entries = await fs.readdir(targetPath);
  return entries.length > 0;
}

async function assertCreatableDirectory(targetDir, { force, inPlace }) {
  if (!(await pathExists(targetDir))) {
    return;
  }

  if (await isNonEmptyDirectory(targetDir)) {
    if (!force) {
      const hint = inPlace
        ? 'The current directory is not empty. Use --force to continue.'
        : `Directory "${targetDir}" is not empty. Use --force to continue.`;
      throw new CliError(hint);
    }
  }
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function walkFiles(rootDir) {
  const results = [];

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results;
}

async function copyTemplates(templateRoot, destinationRoot, placeholders, features = {}) {
  if (!(await pathExists(templateRoot))) {
    throw new CliError(`Template directory not found: ${templateRoot}`);
  }

  const files = await walkFiles(templateRoot);
  if (files.length === 0) {
    throw new CliError('No template files were found. The generator package may be corrupt.');
  }

  for (const sourceFile of files) {
    const relativePath = path.relative(templateRoot, sourceFile);
    const outputRelativePath = toOutputRelativePath(relativePath);
    const destinationFile = path.join(destinationRoot, outputRelativePath);

    await ensureDir(path.dirname(destinationFile));

    if (isBinaryFile(sourceFile)) {
      await fs.copyFile(sourceFile, destinationFile);
      continue;
    }

    const raw = await fs.readFile(sourceFile, 'utf8');
    const rendered = renderTextTemplate(raw, placeholders, features);
    await fs.writeFile(destinationFile, rendered, 'utf8');
  }

  return files.length;
}

module.exports = {
  pathExists,
  isNonEmptyDirectory,
  assertCreatableDirectory,
  ensureDir,
  walkFiles,
  copyTemplates,
};
