---
name: Frasch Ruchtschriwing
description: A serif reading page in the manner of a printed dictionary, for the website of the North Frisian (Mooring) spell checker.
colors:
  flag-blue: "#1f4e9c"
  flag-gold: "#f7c600"
  flag-red: "#d11a2a"
  paper: "#fafaf7"
  surface: "#ffffff"
  ink: "#17191f"
  hairline: "#c8c8c1"
  link-strong: "#173c7a"
  action-text: "#ffffff"
  hover-ground: "#eef1f7"
  note-ground: "#fcf1bf"
  note-edge: "#b38f00"
  paper-dark: "#15171c"
  surface-dark: "#1d2027"
  ink-dark: "#eceae3"
  hairline-dark: "#3a3e48"
  link-dark: "#a8c3f4"
  link-strong-dark: "#c7d9fa"
  action-text-dark: "#12151b"
  hover-ground-dark: "#262b36"
  note-ground-dark: "#2d2709"
  note-edge-dark: "#8a7000"
typography:
  display:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "clamp(2.125rem, 1.4rem + 3.4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "clamp(1.5rem, 1.3rem + 1vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.4375rem)"
    fontWeight: 700
    lineHeight: 1.2
  lead:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "clamp(1.25rem, 1.15rem + 0.5vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, 'Noto Serif', Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  radius: "2px"
spacing:
  2xs: "0.25rem"
  xs: "0.5rem"
  s: "0.75rem"
  m: "1rem"
  l: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
components:
  button:
    backgroundColor: "{colors.flag-blue}"
    textColor: "{colors.action-text}"
    typography: "{typography.title}"
    rounded: "{rounded.radius}"
    padding: "0.75rem 2rem"
    height: "3.5rem"
  button-hover:
    backgroundColor: "{colors.link-strong}"
    textColor: "{colors.action-text}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.flag-blue}"
    typography: "{typography.title}"
    rounded: "{rounded.radius}"
    padding: "0.75rem 2rem"
    height: "3.5rem"
  button-quiet-hover:
    backgroundColor: "{colors.hover-ground}"
    textColor: "{colors.link-strong}"
  tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "1.5rem 1.5rem 2rem"
  tile-hover:
    backgroundColor: "{colors.hover-ground}"
    textColor: "{colors.ink}"
  note-box:
    backgroundColor: "{colors.note-ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "1.5rem"
  menu-entry-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    padding: "0 1rem"
    height: "3rem"
  skip-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    padding: "0.75rem 1.5rem"
---

# Design System: Frasch Ruchtschriwing

This file records the look of the website as it is built. The source is `website/src/styles/global.css`. That file holds every value named here as a custom property. If this file and the stylesheet disagree, the stylesheet is right and this file is out of date.

## Overview

**Creative North Star: "The Wordbook"**

The site looks like a page of a printed dictionary. Serif text stands on near-white paper. Thin ink lines divide the page. Headings are bold, like the headwords of a dictionary. A visitor finds their program the way they find a word: by its bold name at the left edge.

The page is calm and large. The text is big, the buttons are big, and one line of text is never longer than about 70 characters. There are no shadows, no gradients as decoration and no rounded cards. The three flag colours appear as a stripe across the top of every page. Below the stripe they are accents only.

The site has no JavaScript and loads no font files. Every effect is plain CSS. The dark version follows the setting of the device.

**Key Characteristics:**

- One serif typeface from the device, for everything.
- Near-white paper and blue-black ink, with ink lines of 1px and 2px.
- Corners of 2px. No shadows.
- A flag stripe of 8px (0.5rem) across the top of every page.
- Blue marks what can be clicked. Gold marks a note.
- The current page hangs from the header line as a dark tab, like the thumb index of a dictionary.
- In a tile and in a note box the heading stands at the left and the text below it is indented, like a dictionary entry.

## Colors

The palette is paper, ink and the three flag colours. Each colour has one job.

The light values are listed first. Each dark value replaces its light partner when the device asks for the dark version. The flag colours are the same in both versions.

### Primary

- **Flag Blue** (#1f4e9c): Links and the ground of the main button in the light version. It is also the keyboard focus ring in the light version and the right third of the stripe. Contrast as link text: 7.6:1 on paper and 8.0:1 on the white tile surface. White button text on it: 8.0:1.
- **Deep Flag Blue** (#173c7a, `link-strong`): A link or a button under the pointer in the light version.
- **Pale Sky Blue** (#a8c3f4, `link-dark`): Links and the ground of the main button in the dark version. Contrast as link text: 10.1:1 on dark paper and 9.1:1 on the dark tile surface.
- **Lighter Sky Blue** (#c7d9fa, `link-strong-dark`): A link or a button under the pointer in the dark version.
- **Button White** (#ffffff, `action-text`): Text on the main button in the light version.
- **Button Ink** (#12151b, `action-text-dark`): Text on the main button in the dark version. Contrast on Pale Sky Blue: 10.3:1.

### Secondary

- **Flag Gold** (#f7c600): The left third of the stripe, the ground of selected text and the keyboard focus ring in the dark version. As a focus ring on dark paper it has a contrast of 11.1:1. It is never a text colour.
- **Note Gold** (#fcf1bf, `note-ground`): The ground of a note box in the light version. It is a tint of the flag gold. Ink on it: 15.5:1. A link on it: 7.0:1.
- **Note Edge** (#b38f00, `note-edge`): The 1px border of a note box in the light version.
- **Dark Note Gold** (#2d2709, `note-ground-dark`): The ground of a note box in the dark version. Ink on it: 12.4:1. A link on it: 8.4:1.
- **Dark Note Edge** (#8a7000, `note-edge-dark`): The border of a note box in the dark version.

### Tertiary

- **Flag Red** (#d11a2a): The middle third of the stripe. The stylesheet uses it nowhere else.

### Neutral

- **Paper** (#fafaf7): The page background in the light version.
- **Surface** (#ffffff): The background of a tile in the light version.
- **Ink** (#17191f): Text, the strong lines, the tab of the current page and the skip link. Contrast on paper: 16.8:1.
- **Hairline** (#c8c8c1): The thin dividing line inside the text (`<hr>`).
- **Hover Ground** (#eef1f7): The background of a tile or of a quiet button under the pointer.
- **Dark Paper** (#15171c, `paper-dark`): The page background in the dark version.
- **Dark Surface** (#1d2027, `surface-dark`): The background of a tile in the dark version.
- **Dark Ink** (#eceae3, `ink-dark`): Text and strong lines in the dark version. Contrast on dark paper: 14.9:1.
- **Dark Hairline** (#3a3e48, `hairline-dark`): The thin dividing line in the dark version.
- **Dark Hover Ground** (#262b36, `hover-ground-dark`): The hover background in the dark version.

### Named Rules

**The Blue Means Click Rule.** Below the flag stripe, blue marks only what a visitor can click: links, buttons and the focus ring around them in the light version. Text that is not a link is never blue.

**The Gold Is Ground Rule.** Gold is a background or a ring, never text. It appears as the note box ground, as the ground of selected text, as the dark focus ring and in the stripe.

**The Two Versions Rule.** Every colour that has a job has a light and a dark value. A new colour needs both, and both must meet WCAG AA for the text on it.

## Typography

**Display Font:** Charter (with Bitstream Charter, Sitka Text, Cambria, Noto Serif, Georgia, serif)
**Body Font:** the same stack

**Character:** One serif typeface does all the work, as in a printed dictionary. The fonts are already on the device, so no font file is loaded. A visitor may see Charter, Sitka, Cambria or another serif from the list, depending on the device.

### Hierarchy

- **Display** (700, clamp(2.125rem, 1.4rem + 3.4vw, 3.5rem), line height 1.1, letter spacing -0.015em): The page title (`h1`). At most 50rem wide.
- **Headline** (700, clamp(1.5rem, 1.3rem + 1vw, 2rem), line height 1.2, letter spacing -0.01em): Section headings (`h2`) and the title of a tile.
- **Title** (700, clamp(1.25rem, 1.15rem + 0.5vw, 1.4375rem), line height 1.2): Sub-headings (`h3`), the heading of a note box, the site name in the header and the text of a button.
- **Lead** (400, clamp(1.25rem, 1.15rem + 0.5vw, 1.4375rem), line height 1.5): The intro paragraph directly below the page title.
- **Body** (400, clamp(1.125rem, 1.05rem + 0.35vw, 1.25rem), line height 1.6): Running text and the menu. A line is at most 42.5rem wide, about 70 characters.
- **Label** (400, 1.0625rem): The language names in the header and the footer. This is the smallest text on the site.

### Named Rules

**The One Serif Rule.** There is one font stack and two weights: 400 for text and 700 for headings, buttons and emphasis. No second typeface.

**The Large Text Rule.** No text is smaller than 1.0625rem (17px at the usual browser setting). Body text is at least 1.125rem (18px).

**The Upright Is Here Rule.** In the language switcher the other languages are italic and underlined. The language of the page is upright, bold and not underlined. This is the only use of italics in the layout.

## Layout

The content sits in one centred column. It is at most 65rem wide. To its left and right stays a free space of clamp(1.25rem, 5vw, 2.5rem). Headings, paragraphs and lists start at the left edge of this column and are at most 42.5rem wide. Nothing is centred.

From top to bottom every page has the same frame:

1. The flag stripe, 0.5rem high, across the full window.
2. The header line: icon (2.5rem) and site name at the left, the language names at the far right. A 2px ink line closes it.
3. The menu row, starting at the left edge below the icon.
4. The main area. It has clamp(2.5rem, 1.5rem + 4vw, 4.5rem) of space above and 6rem below.
5. The footer, with a 1px ink line above it. On a short page it stays at the bottom of the window.

Spacing uses nine steps from 0.25rem to 6rem. A section heading has 3rem above it and 0.75rem below. A paragraph has 1rem below it. Tile groups and note boxes have 2rem above and below.

Tiles stand side by side when each can be at least 18rem wide. Otherwise they stand below each other. There is one fixed breakpoint: below a window width of 36rem the menu becomes a table of two columns. The header line wraps by itself when the name and the languages do not fit in one row.

Everything a visitor can click or tap is at least 3rem high. A button is at least 3.5rem high.

When a page is printed, the menu, the language switcher and the skip link are left out.

### Named Rules

**The Left Edge Rule.** Icon, site name, menu, page title and text all start at the same left edge. Nothing is centred.

**The Measure Rule.** Running text is never wider than 42.5rem. Only a group of tiles, and a note box next to one, use the full width of the column.

## Elevation & Depth

The site is flat. There are no shadows. A tile differs from the page by a 1px ink border and a slightly lighter surface. A note box differs by its gold ground. Under the pointer a tile changes its background. Nothing lifts or casts a shadow.

### Named Rules

**The Ink Line Rule.** Parts of the page are divided by lines and borders, never by shadows.

## Shapes

Shapes are rectangles with corners of 2px. This applies to buttons, tiles, note boxes and the focus ring. The tab of the current page has square corners at the top, where it touches the line, and 2px corners at the bottom.

There are three kinds of line:

- A 2px ink line below the header line. Buttons also have a 2px border.
- A 1px ink line above the footer and around a tile. A note box has a 1px border in its own edge colour.
- A 1px hairline for a divider inside the text.

The flag stripe is three equal parts with hard edges: gold, red, blue.

Icons are drawn lines, 24 units wide, with a stroke of 2.25 and round ends. They take the colour of the text next to them. Two exist: a download arrow in the button and an arrow to the right in the tile.

## Components

All building blocks are plain links and boxes. They work without JavaScript. Pointer hover and keyboard focus give the same feedback.

Colour, background and underline changes take 140ms with an ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`). If the device asks for less movement, there are no transitions.

### Buttons

Large and plain. For the main action of a page, for example a download.

- **Shape:** A rectangle with 2px corners, at least 3.5rem high, padding 0.75rem above and below and 2rem left and right.
- **Primary:** Blue ground with white text in the light version. Pale blue ground with dark text in the dark version. Text is bold in the Title size. An optional download icon stands in front of the text.
- **Hover / Focus:** The ground gets darker in the light version and lighter in the dark version. While pressed, the button moves down by 1px.
- **Quiet:** For a second, less important action next to a main button. No ground, blue text and a 2px border in the text colour. Under the pointer it gets the hover ground.
- **Forced colours:** The primary button has a transparent 2px border. It shows the shape of the button when the device replaces all colours.

### Tiles

Large link cards, one per choice, for example one per program. The whole tile is one link. On the start page the tiles are the main action.

- **Corner Style:** 2px.
- **Background:** Surface. Hover ground under the pointer or with keyboard focus.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px ink.
- **Internal Padding:** 1.5rem, and 2rem at the bottom.
- **Title:** Bold, in the Headline size, in link blue. The words are underlined. An arrow stands at the right end of the title row and is not underlined.
- **Text:** One short text in ink, indented by 1.4em below the title.
- **Hover / Focus:** The underline of the title gets thicker (0.07em to 0.12em). The arrow moves 0.25rem to the right. The title takes the stronger blue.
- **Group:** Tiles sit in a grid with a gap of 1.5rem.

### Note Box

A text the visitor should not miss. It is marked as a note for screen readers.

- **Style:** Gold-tinted ground, 1px border in the note edge colour, 2px corners, padding 1.5rem.
- **Heading:** Optional. Bold, in the Title size. The text below a heading is indented by 1.4em, as in a tile.
- **Width:** At most 42.5rem. Next to a group of tiles the box is as wide as the group.

### Navigation

- **Site name:** Icon and name, bold, in ink, in the Title size. Not underlined. Under the pointer the name gets an underline.
- **Menu:** A row of links in the Body size with 2rem between them. Each is 3rem high. Under the pointer the underline gets thicker (0.07em to 0.14em).
- **Current page:** A dark tab in ink with paper-coloured bold text and 1rem of padding left and right. It touches the 2px line above it.
- **Language switcher:** The written-out names of the languages in the Label size, at the far right of the header line. See The Upright Is Here Rule.
- **Phone:** Below 36rem the menu is a table of two columns.
- **Footer:** The site name in bold at the left, two links at the right, all in the Label size.

### Links

- **Style:** Link blue with a thin underline (0.07em thick, 0.2em below the text).
- **Hover:** The stronger blue and a thicker underline (0.14em).

### Focus Ring

- **Style:** A 3px solid ring, 3px away from the element. Blue in the light version, flag gold in the dark version.

### Skip Link

- **Style:** A bold link on an ink ground with paper-coloured text. It stays above the window. With keyboard focus it slides in below the flag stripe, in line with the left edge of the content.

### Flag Stripe

- **Style:** Gold, red and blue in three equal parts, 0.5rem high, across the full window at the top of every page. It keeps its colours when the device replaces all other colours.

## Do's and Don'ts

### Do:

- **Do** use the custom properties at the top of `website/src/styles/global.css` for every colour, type size and spacing value.
- **Do** give a new colour a light and a dark value, and check that both meet WCAG AA.
- **Do** start headings and text at the left edge of the column, and keep running text within 42.5rem.
- **Do** make everything that can be clicked at least 3rem high.
- **Do** underline links. An underline is how a visitor sees that words can be clicked.
- **Do** give pointer hover and keyboard focus the same feedback.
- **Do** put every transition inside the `prefers-reduced-motion: no-preference` block.
- **Do** use the indented entry shape for new boxes: heading at the left, text indented by 1.4em.

### Don't:

- **Don't** use gold as a text colour.
- **Don't** use blue for text or boxes that cannot be clicked.
- **Don't** use red outside the flag stripe and the icon.
- **Don't** add shadows, larger corner radii or decorative gradients.
- **Don't** add a second typeface or load a font file.
- **Don't** set text smaller than 1.0625rem.
- **Don't** centre headings or text.
- **Don't** add JavaScript, `<style>` blocks in components or `style` attributes. All styles are in the one stylesheet.
