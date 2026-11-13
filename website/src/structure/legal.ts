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
 *   A language that is not listed is optional. While its file is missing, the
 *   footer links and the language switcher on the legal page lead to the legal
 *   page in `bindingLanguage`. Adding the file later needs no code change.
 */
export const legalPage = {
	bindingLanguage: 'de',
	requiredLanguages: ['de', 'en'],
} as const satisfies { bindingLanguage: LanguageKey; requiredLanguages: readonly LanguageKey[] };
