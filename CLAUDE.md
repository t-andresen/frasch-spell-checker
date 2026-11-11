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
| `npm run build` | Type check, then build into `website/dist/`, then the checks of the built site |
| `npm run preview` | Serves the finished build from `website/dist/` |
| `npm test` | Tests of the text markup and of the checks of the built site |
| `npm run check:launch` | Fails and lists every placeholder that is left in `website/src/`. Not part of the build, because placeholders are expected until all text is written |

An agent starts the local preview with `npx astro dev --background` and stops it with `npx astro dev stop`, so the command does not block the session.

Run `npm run build` before you open a pull request. It must pass.

## Website conventions

- **Languages** are defined only in `website/src/i18n/languages.ts`: internal key, address prefix, HTML `lang` tag, display name. North Frisian is the default and has no prefix. German is under `/de/`, English under `/en/`.
- **The Frisian `lang` tag** will change to a dialect tag later. Read it from `htmlLang` in the `languages` module. Never write it as a string anywhere else.
- **Internal links** always go through `website/src/lib/links.ts`: `pageLink(language, page)` for pages and `fileLink(path)` for files. A link written by hand misses the base path and breaks on GitHub Pages.
- **Address and base path** (`site`, `base`) are set only in `website/astro.config.ts`.
- **Text per language** lives in typed text modules, so the type check fails when a language lacks a text. See "Website text" below.
- **Every page uses the layout** `website/src/layouts/Layout.astro`. It supplies `<head>`, skip link, flag stripe, header with menu and language switcher, and footer. A page passes its page id and its title: `<Layout page="about" title={text.about.title}>`.
- **All styles are in one file**, `website/src/styles/global.css`. No `<style>` blocks in components and no `style` attributes. Colours, type sizes and spacing are custom properties at the top of that file. Use them instead of new values. A new colour needs a value for the light and for the dark version, and its contrast must meet WCAG AA in both.
- **Building blocks** are in `website/src/components/`: `Button.astro`, `Tile.astro` inside `TileGroup.astro`, and `NoteBox.astro`. The class `lead` marks the intro paragraph below the page title. Each component file starts with an example of its use.
- **The site name** is defined only in `website/src/structure/site.ts`.
- **The icon** is `website/public/icon.svg`, with `icon-128.png` for browsers that cannot show SVG icons. Both are copies of the files in `resources/`.

## Website text

No text is written into a page file. Paths below are inside `website/src/`. Order, screenshots and link addresses never go into a language module. So they cannot differ between languages.

### Placeholders

A text that is not written yet holds a placeholder that names its language and its key, for example `[[frr:word.steps.moveFile.text]]`. This applies to all three languages. `npm run check:launch` finds every text of this form in `src/`, also in Markdown files. Do not write a literal placeholder into a comment in `src/`, because the launch check would report it.

### Emphasis and links in a text

The types `Plain` and `Rich` in `text/types.ts` say what a text can contain.

- `Plain` is shown exactly as written. Pages output it with `{text}`.
- `Rich` can contain the markup below. Pages output it with `<RichText text={...} />` from `components/RichText.astro`.

| Markup | Result |
| :-- | :-- |
| `*text*` | Emphasis |
| `**text**` | Strong emphasis |
| `[text](linkName)` | Link. `linkName` is a name from `structure/textLinks.ts`, never an address |
| `\*`, `\[`, `\]`, `\\` | The literal character. In a TypeScript string, write the backslash twice |

Nothing else has a meaning. HTML in a text is shown as plain characters. The build stops when a `Rich` text has a marker without its closing partner or an unknown link name. The parser is `lib/richText.ts`.

### Files that Node runs directly

`scripts/check-launch.ts`, `lib/placeholders.ts`, `lib/richText.ts`, `lib/siteCheck.ts` and the test files run in Node without Astro. They must not import from Astro, and their imports end in `.ts`.
