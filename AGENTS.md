<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

# Update packages

Use `context7` mcp to check breaking changes.

# Commit Rules

- Use Conventional Commits for every commit message.
- Format commit subjects as `type(scope): summary` when a scope is useful, or `type: summary` when it is not.
- Use lowercase commit types such as `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, and `ci`.
- Keep the summary concise and imperative, for example `feat(auth): add login rate limiting`.
- Mark breaking changes with `!` in the subject or describe them in the commit body.