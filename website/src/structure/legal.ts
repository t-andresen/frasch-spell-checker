import type { LanguageKey } from '../i18n/languages';

/**
 * The legal page: Impressum and privacy statement.
 *
 * Unlike all other pages, its text is Markdown, one file per language in
 * `src/content/legal/`. The file name is the language key, for example `de.md`.
 *
 * - `bindingLanguage`: the version that counts legally. Every other version is a
 *   translation and shows a note with a link to this one.
 * - `requiredLanguages`: the build stops if one of these files is missing.
 *   A language that is not listed is optional. While its file is missing, its
 *   footer links to the legal page in `bindingLanguage`. Adding the file later
 *   needs no code change.
 * - `switcherFallbackLanguage`: on the legal page, the entry of the language
 *   switcher for a language without a file leads to the legal page in this
 *   language. It must be one of the `requiredLanguages`.
 */
export const legalPage = {
	bindingLanguage: 'de',
	requiredLanguages: ['de', 'en'],
	switcherFallbackLanguage: 'en',
} as const satisfies {
	bindingLanguage: LanguageKey;
	requiredLanguages: readonly LanguageKey[];
	switcherFallbackLanguage: LanguageKey;
};
