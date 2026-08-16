'use strict';

function buildGeneratedPackageJson({ packageName, description, features }) {
  const dependencies = {
    '@emotion/cache': '^11.14.0',
    '@emotion/react': '^11.14.0',
    '@emotion/styled': '^11.14.1',
    '@hookform/resolvers': '^5.9.0',
    '@mui/icons-material': '^9.3.1',
    '@mui/material': '^9.3.1',
    '@mui/material-nextjs': '^9.3.0',
    '@tanstack/react-query': '^5.101.4',
    clsx: '^2.1.1',
    'date-fns': '^4.1.0',
    next: '^16.3.1',
    react: '^19.2.8',
    'react-dom': '^19.2.8',
    'react-hook-form': '^7.62.0',
    'server-only': '^0.0.1',
    zod: '^4.4.3',
    zustand: '^5.0.15',
  };

  const devDependencies = {
    '@playwright/test': '^1.55.0',
    '@testing-library/jest-dom': '^6.8.0',
    '@testing-library/react': '^16.3.0',
    '@testing-library/user-event': '^14.6.1',
    '@types/node': '^24.3.0',
    '@types/react': '^19.2.2',
    '@types/react-dom': '^19.2.2',
    '@vitejs/plugin-react': '^5.0.2',
    eslint: '^9.34.0',
    'eslint-config-next': '^16.3.1',
    'eslint-config-prettier': '^10.1.8',
    jsdom: '^26.1.0',
    prettier: '^3.6.2',
    typescript: '^5.9.2',
    vitest: '^3.2.4',
  };

  if (features.storybook) {
    devDependencies.storybook = '^9.1.3';
    devDependencies['@storybook/nextjs'] = '^9.1.3';
    devDependencies['@storybook/addon-essentials'] = '^8.6.14';
  }

  if (features.sentry) {
    dependencies['@sentry/nextjs'] = '^10.5.0';
  }

  if (features.analytics) {
    dependencies['@vercel/analytics'] = '^1.5.0';
  }

  if (features.pwa) {
    dependencies.serwist = '^9.2.1';
    dependencies['@serwist/next'] = '^9.2.1';
  }

  const scripts = {
    dev: 'next dev',
    build: 'next build',
    start: 'next start',
    lint: 'eslint .',
    format: 'prettier --write .',
    'format:check': 'prettier --check .',
    typecheck: 'tsc --noEmit',
    test: 'vitest run',
    'test:watch': 'vitest',
    'test:e2e': 'playwright test',
  };

  if (features.storybook) {
    scripts.storybook = 'storybook dev -p 6006';
    scripts['build-storybook'] = 'storybook build';
  }

  return {
    name: packageName,
    version: '0.1.0',
    private: true,
    description,
    scripts,
    dependencies,
    devDependencies,
    engines: {
      node: '>=20.9.0',
    },
  };
}

module.exports = { buildGeneratedPackageJson };
