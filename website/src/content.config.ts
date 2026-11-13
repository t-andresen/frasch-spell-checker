/**
 * The content collections of the site. Astro reads this file at the start of
 * every build. The only collection is the text of the legal page.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The legal page, one Markdown file per language in `src/content/legal/`.
 * The file name is the language key, for example `de.md`. Astro uses it as the
 * id of the entry. `src/structure/legal.ts` says which files must exist.
 */
const legal = defineCollection({
	loader: glob({ base: './src/content/legal', pattern: '*.md' }),
	schema: z.object({
		/** The title of the page, for the heading and the browser tab. */
		title: z.string(),
		/**
		 * Only in a translation: the note that the version in the binding
		 * language counts, and the text of the link to that version.
		 */
		translationNote: z.object({ text: z.string(), linkText: z.string() }).optional(),
	}),
});

export const collections = { legal };
