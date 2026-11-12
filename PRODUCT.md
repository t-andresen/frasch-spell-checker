# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Everyday users of North Frisian (Mooring): speakers, learners and teachers. They are not developers.

The first visitor to design for has little computer practice. Many rarely install software, and some are older speakers. They come to the site to get the spell checker working in the word processor they already use: LibreOffice or Microsoft Word on Windows. The site must show every click and assume no prior knowledge of extensions, dictionaries or settings menus.

## Product Purpose

"Frasch Ruchtschriwing" is a small static website for the North Frisian (Mooring) spell checker. It gives an overview of the spell checker, offers the downloads and explains how to install them.

Success means a visitor with little computer practice gets the spell checker running in LibreOffice or Word without outside help, and knows how to report a missing or wrong word.

## Positioning

As far as the maintainer knows, this is the only spell checker for Mooring. The site may say so.

The spell checker is a helpful tool, not a standard. The site says this visibly: everyone writes how and what they prefer. The site must never present the word list as the correct or official way to write Mooring.

## Operating Context

- Pages per language: Start, LibreOffice, MS Word, About, and Legal (Impressum and privacy statement).
- LibreOffice: a direct download of the `.oxt` file is the main action. A link to the LibreOffice extension site comes second.
- MS Word on Windows: a download of `Frasch.dic` with install steps.
- Mac: only a note that instructions are in preparation (issue #1).
- Not supported, stated in one line: iPhone and iPad, Word in the browser, Google Docs.
- Hunspell files: no download and no instructions. One line on the About page links to the GitHub repository.
- Feedback: email first, at a separate project address that does not exist yet (issue #22). GitHub issues second. There is no contact form.
- Install steps use one set of screenshots with the German program interface, for all three languages. Click targets are marked on the screenshots.

## Capabilities and Constraints

- Languages: North Frisian is the default at the main address. German is under `/de/`, English under `/en/`. The language switcher shows written-out names (Frasch, Deutsch, English) and leads to the same page in the other language.
- The Frisian language tag is `frr` for now and will change to a dialect tag later. It is defined only in `website/src/i18n/languages.ts`.
- All Frisian text is written by the maintainer. Agents never write North Frisian, not even as a draft, a label or an image description. Missing text is a visible placeholder. German and English are translated from the Frisian.
- No cookies, no visitor statistics, no client-side JavaScript, no fonts, scripts or images from other servers.
- All downloads come from `spell_check/` in this repository. All files share one version number, shown on the site with a date.
- Stack: Astro with TypeScript, static output, in `website/`. Text is typed data per language; page structure is defined once. Only the legal page uses Markdown.
- Hosting: GitHub Pages at `t-andresen.github.io/frasch-spell-checker`. Publishing stays off until launch (issue #26). A custom domain may follow.
- Out of scope for the launch: Mac support, Firefox and Thunderbird add-ons, a contact form, a changelog page, an archive of old versions.

Open:
- The license is not settled yet (issue #20).
- The Impressum address is not decided (issue #23). No personal data goes into the repository until the maintainer says so.
- Whether a Frisian legal page exists. If not, Frisian pages link to the German one.

## Brand Commitments

- Name: "Frasch Ruchtschriwing".
- Logo: the existing flag icon. The originals are in `resources/`. The website uses the copy in `website/public/icon.svg`.
- Flag colours as accents: gold `#F7C600`, red `#D11A2A`, blue `#1F4E9C`.
- Look: plain but professional, not barebones. System fonts, large text, large buttons, usable on phones, a dark version that follows the device setting.
- Who is behind it: a private project by the maintainer. The words come from the North Frisian Dictionary Unit at Kiel University, which gets a credit on the About page. The site does not present the Dictionary Unit as a partner.

## Evidence on Hand

- The logo icon. The website has a copy of it in `website/public/`: `icon.svg` and `icon-128.png`. The originals in `resources/` are not in the repository yet; issue #3 commits them.
- The spell check files for `spell_check/`. They are not in the repository yet; issue #3 commits them.
- Screenshots of LibreOffice (issue #18) and of a current Word (issue #19) are still to come.
- There are no testimonials, user numbers, press or endorsements. Future work must not invent any.

## Product Principles

1. **Show every step.** Write for the visitor who has never installed an extension. A step that is obvious to a developer still gets written down and shown.
2. **Offer, do not prescribe.** The spell checker helps; it does not define correct Mooring. Nothing on the site should sound like a rule.
3. **Frisian first.** North Frisian is the default language and the source text. German and English follow it, never the other way round.
4. **Nothing behind the visitor's back.** No tracking, no third-party requests, no scripts. The visitor gets the page and the file, nothing more.
5. **Claim only what is true.** No invented proof, partners or numbers.

## Accessibility & Inclusion

- Visitors include older speakers and people with little computer practice: large text, large buttons, plain steps.
- Must work on phones and in dark mode.
- Every page must work without JavaScript, because the site has none.
