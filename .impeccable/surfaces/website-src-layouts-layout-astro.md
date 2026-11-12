---
version: 1
slug: "website-src-layouts-layout-astro"
primary_target: "website/src/layouts/Layout.astro"
related_targets: ["website/src/styles/global.css"]
---

# Shared layout of the website

Scope: the shared page layout, the one stylesheet and the building blocks (button, tile, note box) for all pages in all three languages. Issue 6. Visitor mode: Read.

Audience and job: a speaker, learner or teacher of Mooring with little computer practice. They want the spell checker running in LibreOffice or Word. The layout must let them find their program within seconds and then read steps without effort.

Constraints from issue 6: near-white ground, dark text, flag stripe on top, flag colours as accents only, blue for links and buttons, gold never as text, system fonts, no JavaScript, one hand-written stylesheet, dark version by device setting, WCAG AA.

Chosen by the maintainer: The Wordbook. Their two corrections to the sketch: the menu must align with the title on the left, and the language links need a clear separation from the menu.

Memorable moment: the current page hangs from the running-head rule as an inverted ink tab, like the thumb index of a dictionary.

Unresolved: the build differs from the sketch the maintainer picked in more than the top bar. The decorative thumb tabs on the page edge were dropped. The tiles are closed boxes instead of open columns under one rule. The note is a gold-tinted box instead of a ruled italic paragraph. The intro has no bold run-in headword. The final report of the build tells the maintainer. They have not confirmed these changes yet.

## Direction contract

THESIS: The site is a page of the wordbook its words come from: a serif reading page under a running head, where a visitor finds their program like a headword. It refuses the centred project hero with rounded shadow cards.

OWN-WORLD: Near-white paper, blue-black ink, ink rules of 1px and 2px, corners of 2px. In a tile and a note box the heading stands out to the left and the text is indented below it, like a dictionary entry. One system serif for everything. Flag stripe in three equal parts across the top. Blue only for links and buttons. Gold only as note ground, text selection and dark focus ring. Red only in stripe and icon.

STORY: The visitor sees the name, finds their program as a headword, follows the steps, and reads that the spell checker is a tool and not a standard.

FIRST VIEWPORT: Stripe of 8px. Masthead row: icon and name on the left, the three language names in italics on the far right. A 2px ink rule. Below it the menu row, flush left with the icon, the current page as an inverted ink tab that touches the rule. Then the page title in bold serif up to 3.5rem, the intro at a measure of about 34em, and the two program tiles side by side as ruled boxes with a blue underlined headword and an arrow. The tiles are the primary action.

PHONE VIEWPORT (below 36rem): Chosen by the maintainer over two other prototypes. Masthead row: icon and name on the left, a bordered "Menu" button with a three-line icon on the right. The 2px ink rule. Below it the three language names, always visible, because a visitor who lands on the Frisian page must find their language without opening anything. The button is a `<details>` summary. The open menu hangs from the rule as a ruled list as wide as the content, and the button turns into an inverted ink tab with a cross.

SIGNATURE INTERACTION AND MOTION: No scripts. Hover and keyboard focus, both with the same feedback: a tile's headword underline thickens and its arrow moves 4px, the underline of a menu entry thickens, a button darkens. 140ms ease-out, on colour, underline and transform only. No motion when the device asks for reduced motion.

FORM: The Wordbook, the printed dictionary page. Position 1 of 7 on the ordered list, chosen by the maintainer over the rolled position 6. seed:883796ba54abf69c

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
