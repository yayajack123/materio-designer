# GitHub starter maintenance

## Continuous integration

CI runs lint and the production build on pull requests, pushes to `main`, and manual dispatches. It uses Node from `.nvmrc` and pnpm from `package.json`, installs with the committed lockfile, and requires no deployment secrets. It does not deploy the application.

Run `pnpm lint:check` for non-mutating validation; `pnpm lint` applies fixes. `.eslintrc.cjs` establishes a Vue essential baseline with TypeScript parsing, permits Vuetify dotted slot names, and allows existing single-word route and legacy component names. It is not a TypeScript typecheck or a full style audit. Generated output and the local pnpm store are ignored. Do not use `--fix` in CI.

## Protect the default branch

After the first successful CI run, open repository Settings > Rules > Rulesets and create an active branch ruleset targeting the default branch:

- Require a pull request before merging.
- Require the `Build` status check, selecting the check produced by this workflow.
- Block force pushes and branch deletion.
- For team projects, require one approval. For solo projects, keep required approvals at zero to avoid blocking the author.

The connected GitHub MCP exposes repository file and pull request operations, but does not expose administration writes for rulesets. Apply these settings in GitHub. Availability depends on the account plan and repository visibility.

## Dependency updates

Dependabot checks npm packages and GitHub Actions weekly. Patch npm updates are grouped; other updates remain separate for review. Updates are not automatically merged.

## Starting another project

Use **Use this template**, then follow [NEW_PROJECT_SETUP.md](../NEW_PROJECT_SETUP.md). Configure branch rules, secrets, deployment environments, and access separately for the new repository. Check Actions is enabled and CI passes there.

Add `CODEOWNERS` once the responsible users or team are known. Verify upstream Materio licensing before distributing licensed source or adding a license for the whole repository.
