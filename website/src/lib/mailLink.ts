/**
 * The address of a link that opens the visitor's mail program.
 *
 * Node runs this file directly for the tests. So it must not import anything
 * from Astro, and its imports end in `.ts`.
 */
import { placeholderAt } from './placeholders.ts';

/**
 * A plain mail address: text, an `@`, text with a dot in it. It contains no
 * space and none of the characters that have a meaning inside a link.
 */
const addressPattern = /^[^\s@?&#%<>"]+@[^\s@?&#%<>"]+\.[^\s@?&#%<>"]+$/;

/**
 * Returns a `mailto:` address, for example `mailLink('name@example.org', 'A word is missing')`.
 * The mail program opens a new mail to `address` with `subject` filled in.
 *
 * Throws if `address` is no mail address, so that a typing mistake stops the
 * build. A placeholder passes, because the address may not exist yet.
 */
export function mailLink(address: string, subject: string): string {
	const isPlaceholder = placeholderAt(address, 0) === address;
	if (!isPlaceholder && !addressPattern.test(address)) {
		throw new Error(`"${address}" is not a mail address. Expected a form like name@example.org.`);
	}
	// `encodeURIComponent` writes a space as `%20`. Mail programs need that form and do not understand `+`.
	return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
}
