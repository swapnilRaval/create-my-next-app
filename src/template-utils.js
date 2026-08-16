'use strict';

const path = require('path');
const { BINARY_EXTENSIONS, DOTFILE_RENAMES } = require('./constants');

function isBinaryFile(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function applyPlaceholders(content, values) {
  return content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      return String(values[key]);
    }
    return match;
  });
}

function applyConditionals(content, features) {
  const flags = features || {};

  let output = content.replace(/\{\{#if\s+([A-Z0-9_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, body) => {
    return flags[key] ? body : '';
  });

  output = output.replace(/\{\{#unless\s+([A-Z0-9_]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (_, key, body) => {
    return flags[key] ? '' : body;
  });

  return output;
}

function renderTextTemplate(content, placeholders, features) {
  return applyPlaceholders(applyConditionals(content, features), placeholders);
}

function toOutputRelativePath(relativePath) {
  const parts = relativePath.split(path.sep);
  const fileName = parts[parts.length - 1];
  if (DOTFILE_RENAMES[fileName]) {
    parts[parts.length - 1] = DOTFILE_RENAMES[fileName];
  }
  return parts.join(path.sep);
}

module.exports = {
  isBinaryFile,
  applyPlaceholders,
  applyConditionals,
  renderTextTemplate,
  toOutputRelativePath,
};
