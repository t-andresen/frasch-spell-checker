/**
 * Writes a date the way a language writes it, in numbers only, so that no
 * language needs month names. The forms are `dateFormat` in `src/i18n/languages.ts`:
 * `formatDate('2026-11-18', 'de')` is `18.11.2026`, `formatDate('2026-11-18', 'en')` is `2026-11-18`.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { getLanguage, type LanguageKey } from '../i18n/languages.ts';

export function formatDate(isoDate: string, language: LanguageKey): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
	if (match === null) {
		throw new Error(`"${isoDate}" is not a date of the form YYYY-MM-DD.`);
	}
	const [, year = '', month = '', day = ''] = match;
	return getLanguage(language).dateFormat.replace('YYYY', year).replace('MM', month).replace('DD', day);
}
