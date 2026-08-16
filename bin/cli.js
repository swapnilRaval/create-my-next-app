#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const pkg = require('../package.json');
const { run } = require('../src/index');
const { CliError } = require('../src/errors');
const log = require('../src/logger');

async function main() {
  const program = new Command();

  program
    .name('create-my-next-app')
    .description(pkg.description)
    .version(pkg.version)
    .argument('[project-name]', 'Directory (and package name) for the new Next.js project')
    .option('-y, --yes', 'Skip interactive prompts and use recommended defaults', false)
    .option('--skip-install', 'Skip installing dependencies', false)
    .option('--skip-git', 'Skip git init', false)
    .option('--force', 'Allow creating the project in a non-empty directory', false)
    .option('--pm, --package-manager <name>', 'Package manager to use: npm, yarn, or pnpm')
    .option('--use-npm', 'Use npm to install dependencies', false)
    .option('--use-pnpm', 'Use pnpm to install dependencies', false)
    .option('--use-yarn', 'Use yarn to install dependencies', false)
    .option('--description <text>', 'package.json description for the generated project')
    .option('--storybook', 'Include Storybook', false)
    .option('--playwright', 'Include Playwright (already on by default)', false)
    .option('--no-playwright', 'Skip Playwright end-to-end tests')
    .option('--i18n', 'Include i18n-ready message files', false)
    .option('--pwa', 'Include a conservative PWA manifest setup', false)
    .option('--analytics', 'Include an isolated analytics provider stub', false)
    .option('--sentry', 'Include a Sentry integration point (disabled until DSN is set)', false)
    .option('--docker', 'Include Dockerfile and compose files', false)
    .addHelpText(
      'after',
      `
Examples:
  npx create-my-next-app my-project
  npx create-my-next-app my-project --yes --skip-install
  npx create-my-next-app my-project --pm pnpm
  npx create-my-next-app my-project --storybook --docker
  npm init my-next-app my-project
`
    )
    .action(async (projectName, options) => {
      await run(projectName, options);
    });

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  if (error instanceof CliError) {
    log.error(error.message);
    process.exit(error.exitCode);
  }

  log.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
