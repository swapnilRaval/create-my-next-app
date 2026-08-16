'use strict';

const { collectOptions } = require('./prompts');
const { generateFromCli } = require('./generator');

async function run(projectName, flags = {}) {
  const answers = await collectOptions(projectName, flags);
  return generateFromCli(answers, flags);
}

module.exports = { run };
