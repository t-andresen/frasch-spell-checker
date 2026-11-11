# Frasch spell checker

This repo holds spell check files for North Frisian (Mooring) and the website "Frasch Ruchtschriwing" in `website/`.

The decisions for the website are recorded in issue 2. Read it before any website work:

```sh
gh issue view 2 --repo t-andresen/frasch-spell-checker
```

## Rules for all work

1. **Never write North Frisian text.** The maintainer writes all Frisian. Use a visible placeholder such as `[[frr:start-heading]]`.
2. **Never commit personal data.** No home address and no private email address. Git history in a public repo is permanent.
3. **No third-party requests, no cookies, no client-side JavaScript.** The built pages contain no `<script>` tags and load nothing from other servers.
4. **Do not switch on GitHub Pages and do not add a publishing step** before issue 26.
5. **Check the current Astro documentation** at https://docs.astro.build instead of relying on memory. Use the latest stable version.
6. **One issue per session.** Work on a branch, open a pull request that references the issue, and let the maintainer merge it.
7. **Stay inside the issue.** If you notice something outside its scope, leave a comment or open a new issue.
8. **Say what you could not verify.** Do not present untested steps as tested.

## Website commands

Run all of them in `website/`. The Node version is pinned in `website/.nvmrc` and in `engines` in `website/package.json`.

| Command | What it does |
| :-- | :-- |
| `npm ci` | Installs the packages exactly as the lock file lists them |
| `npm run dev` | Starts the local preview at `http://localhost:4321/frasch-spell-checker/` |
| `npm run check` | Type check of `.astro` and `.ts` files |
| `npm run build` | Type check, then build into `website/dist/` |
| `npm run preview` | Serves the finished build from `website/dist/` |

An agent starts the local preview with `npx astro dev --background` and stops it with `npx astro dev stop`, so the command does not block the session.

Run `npm run build` before you open a pull request. It must pass.

## Website conventions

- **Languages** are defined only in `website/src/i18n/languages.ts`: internal key, address prefix, HTML `lang` tag, display name. North Frisian is the default and has no prefix. German is under `/de/`, English under `/en/`.
- **The Frisian `lang` tag** will change to a dialect tag later. Read it from `htmlLang` in the `languages` module. Never write it as a string anywhere else.
- **Internal links** always go through `website/src/lib/links.ts`: `pageLink(language, page)` for pages and `fileLink(path)` for files. A link written by hand misses the base path and breaks on GitHub Pages.
- **Address and base path** (`site`, `base`) are set only in `website/astro.config.ts`.
- **Text per language** lives in typed data such as `Record<LanguageKey, ...>`, so the type check fails when a language lacks a text.
