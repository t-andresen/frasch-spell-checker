/**
 * The languages of the site. This is the only place that knows them.
 *
 * - `key`: the internal name. Code uses it to pick a language, for example in
 *   `Record<LanguageKey, string>`. It never reaches the browser as a `lang` attribute.
 * - `prefix`: the first part of the address. Empty for the default language.
 *   Astro requires that a non-empty prefix equals the `key` and the folder name
 *   under `src/pages/`.
 * - `htmlLang`: the value of the HTML `lang` attribute.
 * - `name`: the name shown in the language switcher.
 *
 * The Frisian `htmlLang` will change to a dialect tag later. Always read it from
 * here and never write it as a string anywhere else.
 */
export const languages = [
	{ key: 'frr', prefix: '', htmlLang: 'frr', name: 'Frasch' },
	{ key: 'de', prefix: 'de', htmlLang: 'de', name: 'Deutsch' },
	{ key: 'en', prefix: 'en', htmlLang: 'en', name: 'English' },
] as const;

export type Language = (typeof languages)[number];
export type LanguageKey = Language['key'];

/** The language at the main address, without a prefix. */
export const defaultLanguage = languages[0];

/**
 * Returns the language for a key. Throws for an unknown key, so that a wrong
 * key stops the build instead of producing a page with a wrong `lang` attribute.
 */
export function getLanguage(key: string | undefined): Language {
	const language = languages.find((candidate) => candidate.key === key);
	if (!language) {
		const known = languages.map((candidate) => candidate.key).join(', ');
		throw new Error(`Unknown language key "${key}". Known keys: ${known}.`);
	}
	return language;
}
