/**
 * Access to the Markdown files of the legal page in `src/content/legal/`.
 * The collection is defined in `src/content.config.ts`.
 */
import { type CollectionEntry, getCollection } from 'astro:content';
import { getLanguage, type Language, type LanguageKey, languages } from '../i18n/languages';
import { legalPage } from '../structure/legal';
import { checkLegalFiles, legalPageLanguage } from './legalFiles';

export type LegalFile = CollectionEntry<'legal'>;

/**
 * All legal page files, by language. Stops the build if the set of files
 * breaks a rule of `checkLegalFiles`, for example if a required file is missing.
 */
export async function getLegalFiles(): Promise<Map<LanguageKey, LegalFile>> {
	const files = await getCollection('legal');
	checkLegalFiles(
		files.map((file) => ({ language: file.id, hasTranslationNote: file.data.translationNote !== undefined })),
		languages.map((language) => language.key),
		legalPage,
	);
	return new Map(files.map((file) => [getLanguage(file.id).key, file]));
}

/** Whether the legal page exists in this language. */
export async function hasLegalPage(language: LanguageKey): Promise<boolean> {
	return (await getLegalFiles()).has(language);
}

/**
 * The language of the legal page that the pages in `language` link to: the
 * same language if its file exists, otherwise the version that counts legally.
 */
export async function getLegalLinkLanguage(language: LanguageKey): Promise<Language> {
	const fileLanguages = [...(await getLegalFiles()).keys()];
	return getLanguage(legalPageLanguage(language, fileLanguages, legalPage.bindingLanguage));
}
