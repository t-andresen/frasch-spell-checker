/**
 * Placeholders mark text that is not written yet.
 *
 * A placeholder has this form: two opening square brackets, a language key,
 * a colon, the key of the text, two closing square brackets. The file
 * `CLAUDE.md` shows an example. This file avoids a literal example, because
 * `npm run check:launch` would report it as a placeholder that is left.
 *
 * Node runs this file directly for `check:launch` and for the tests.
 * So it must not import anything from Astro.
 */
const placeholderSource = String.raw`\[\[[a-z]{2,3}(?:-[a-z0-9]+)*:[^\[\]\s]+\]\]`;

/** Returns all placeholders in a text, in order. */
export function findPlaceholders(text: string): string[] {
	return text.match(new RegExp(placeholderSource, 'g')) ?? [];
}

/** Returns the placeholder that starts exactly at `position`, if there is one. */
export function placeholderAt(text: string, position: number): string | undefined {
	// The `y` flag makes the pattern match only at `lastIndex`.
	const pattern = new RegExp(placeholderSource, 'y');
	pattern.lastIndex = position;
	return pattern.exec(text)?.[0];
}
