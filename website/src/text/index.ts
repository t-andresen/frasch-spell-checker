/**
 * All website text, per language. Pages read their text from here.
 *
 * TypeScript reports an error if a language is missing, or if a language
 * lacks a text or has a text under a misspelled key.
 */
import type { LanguageKey } from '../i18n/languages';
import de from './de';
import en from './en';
import frr from './frr';
import type { SiteText } from './types';

const siteText = { frr, de, en } satisfies Record<LanguageKey, SiteText>;

/** Returns all text of one language, for example `getText('de').start.title`. */
export function getText(language: LanguageKey): SiteText {
	return siteText[language];
}
