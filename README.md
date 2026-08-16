# create-my-next-app

Scaffold a production-oriented Next.js + React + TypeScript + Material UI application with one command.

```bash
npx create-my-next-app my-project
```

After generation you own the new app. This package is only the generator.

## Why this generator

The generated project is meant for SaaS, admin, CRM, and internal tools:

- Next.js App Router
- TypeScript strict mode
- Material UI with light / dark / system color schemes
- Cookie-based BFF authentication
- TanStack Query for server state
- Zustand for UI state
- React Hook Form + Zod
- Feature-first folders
- Vitest and Playwright

Optional extras stay off unless you ask for them: Storybook, i18n files, PWA manifest, analytics stub, Sentry hook, Docker.

## Requirements

- Node.js 20.9 or newer
- npm, yarn, or pnpm
- Git is optional (`--skip-git`)

## Installation

One-off:

```bash
npx create-my-next-app my-project
```

Because the package follows the `create-*` convention:

```bash
npm init my-next-app my-project
```

Global:

```bash
npm install -g create-my-next-app
create-my-next-app my-project
```

## CLI

```text
create-my-next-app [project-name] [options]
```

If `project-name` is omitted, the CLI asks for one. Use `.` to generate into the current directory.

### Options

| Option | Description |
| --- | --- |
| `-y, --yes` | Skip prompts and use recommended defaults |
| `--skip-install` | Do not install dependencies |
| `--skip-git` | Do not run `git init` |
| `--force` | Allow a non-empty target directory |
| `--pm, --package-manager <name>` | `npm`, `yarn`, or `pnpm` |
| `--use-npm` / `--use-pnpm` / `--use-yarn` | Package manager aliases |
| `--description <text>` | Generated `package.json` description |
| `--storybook` | Add Storybook |
| `--i18n` | Add i18n message files |
| `--pwa` | Add a web app manifest |
| `--analytics` | Add an analytics provider stub |
| `--sentry` | Add a Sentry integration point |
| `--docker` | Add Docker files |
| `--no-playwright` | Keep Playwright out of the feature flags |
| `-V, --version` | Print the generator version |
| `-h, --help` | Show help |

Interactive mode can also ask which extras to include. The recommended stack is generated either way.

## Prompts

When you do not pass `--yes`, the CLI asks for:

- Project name
- Description
- Install dependencies
- Initialize git
- Optional extras

## Examples

```bash
npx create-my-next-app
npx create-my-next-app billing-admin --yes
npx create-my-next-app billing-admin --yes --skip-install --skip-git
npx create-my-next-app billing-admin --pm pnpm --storybook --docker
```

## Local development of the generator

```bash
git clone <this-repo>
cd create-my-next-app
npm install
npm test
```

Link the CLI onto your PATH:

```bash
npm link
create-my-next-app test-project --yes --skip-install
```

Unlink later with `npm unlink -g create-my-next-app`.

## npm pack

```bash
npm pack
npm install -g ./create-my-next-app-1.0.0.tgz
create-my-next-app packed-app --yes --skip-install
```

`npm run pack:check` runs `npm pack --dry-run`.

## Publishing

1. Update the repository URLs in `package.json`.
2. Confirm you are logged in: `npm login` then `npm whoami`.
3. Publish:

```bash
npm publish
```

For a scoped package such as `@your-org/create-my-next-app`, keep `"publishConfig": { "access": "public" }` if the package should be public.

Version bumps:

```bash
npm version patch
npm version minor
npm version major
npm publish
```

## Updating the generator

Change files under `src/` or `templates/`, add tests in `tests/generator.test.js`, then bump the version and publish. Generated apps are copies; they do not auto-update.

## Template engine

The generator copies files with Node `fs` APIs (cross-platform). It:

- Replaces `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, and `{{APP_TITLE}}`
- Supports `{{#if FEATURE}}...{{/if}}` and `{{#unless FEATURE}}...{{/unless}}`
- Copies binary files unchanged
- Renames `gitignore` → `.gitignore` and `env.example` → `.env.example`

No Handlebars dependency is required. The small custom renderer keeps replacements explicit and avoids rewriting arbitrary file contents.

## Testing the generator

```bash
npm test
```

Tests create temporary directories and verify validation, overwrite protection, `--force`, placeholders, and optional Docker files.

## License

MIT
