'use strict';

const prompts = require('prompts');
const { DEFAULT_DESCRIPTION } = require('./constants');
const { CliError } = require('./errors');
const { sanitizePackageName } = require('./validate');

function onCancel() {
  throw new CliError('Cancelled.', 1);
}

function resolveFeatures(flags, answers = {}) {
  return {
    playwright: flags.playwright !== false,
    storybook: Boolean(flags.storybook || answers.storybook),
    i18n: Boolean(flags.i18n || answers.i18n),
    pwa: Boolean(flags.pwa || answers.pwa),
    analytics: Boolean(flags.analytics || answers.analytics),
    sentry: Boolean(flags.sentry || answers.sentry),
    docker: Boolean(flags.docker || answers.docker),
  };
}

async function collectOptions(projectNameArg, flags) {
  if (flags.yes) {
    if (!projectNameArg) {
      throw new CliError('Project name is required when using --yes. Example: create-my-next-app my-project -y');
    }

    return {
      projectName: projectNameArg,
      description: flags.description || DEFAULT_DESCRIPTION,
      install: !flags.skipInstall,
      git: !flags.skipGit,
      features: resolveFeatures(flags),
    };
  }

  const answers = await prompts(
    [
      {
        type: projectNameArg ? null : 'text',
        name: 'projectName',
        message: 'Project name',
        initial: 'my-next-app',
        validate: (value) => {
          const name = sanitizePackageName(value);
          return name ? true : 'Enter a valid project name (lowercase, kebab-case).';
        },
      },
      {
        type: flags.description ? null : 'text',
        name: 'description',
        message: 'Project description',
        initial: DEFAULT_DESCRIPTION,
      },
      {
        type: flags.skipInstall ? null : 'toggle',
        name: 'install',
        message: 'Install dependencies now?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.skipGit ? null : 'toggle',
        name: 'git',
        message: 'Initialize a git repository?',
        initial: true,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: flags.storybook || flags.i18n || flags.pwa || flags.analytics || flags.sentry || flags.docker ? null : 'multiselect',
        name: 'optional',
        message: 'Optional extras (recommended stack is already included)',
        choices: [
          { title: 'Storybook', value: 'storybook' },
          { title: 'i18n message files', value: 'i18n' },
          { title: 'PWA manifest', value: 'pwa' },
          { title: 'Analytics stub', value: 'analytics' },
          { title: 'Sentry integration point', value: 'sentry' },
          { title: 'Docker files', value: 'docker' },
        ],
        hint: 'Space to select. Enter to continue.',
      },
    ],
    { onCancel }
  );

  const selected = new Set(answers.optional || []);

  return {
    projectName: projectNameArg || answers.projectName,
    description: flags.description || answers.description || DEFAULT_DESCRIPTION,
    install: flags.skipInstall ? false : answers.install !== false,
    git: flags.skipGit ? false : answers.git !== false,
    features: resolveFeatures(flags, {
      storybook: selected.has('storybook'),
      i18n: selected.has('i18n'),
      pwa: selected.has('pwa'),
      analytics: selected.has('analytics'),
      sentry: selected.has('sentry'),
      docker: selected.has('docker'),
    }),
  };
}

module.exports = { collectOptions, resolveFeatures };
