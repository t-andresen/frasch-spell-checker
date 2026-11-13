/**
 * Rules for the Markdown files of the legal page. Each file is named after a
 * language key, for example `de.md`. `src/structure/legal.ts` says which files
 * must exist and which version counts legally.
 *
 * Node runs this file directly for the tests. So it must not import anything
 * from Astro. The functions get all they need as arguments.
 */

/** What the checks need to know about one file. */
export type LegalFileInfo = {
	/** The name of the file without `.md`. */
	language: string;
	/** Whether the head of the file has a `translationNote`. */
	hasTranslationNote: boolean;
};

export type LegalRules = {
	/** Key of the language whose version counts legally. */
	bindingLanguage: string;
	/** Keys of the languages whose file must exist. */
	requiredLanguages: readonly string[];
};

function pathOf(language: string): string {
	return `src/content/legal/${language}.md`;
}

/**
 * Stops the build if the set of files is wrong:
 *
 * - a file is not named after a language key from `knownLanguages`
 * - a required file is missing
 * - a translation has no `translationNote`, or the version that counts
 *   legally has one
 */
export function checkLegalFiles(files: readonly LegalFileInfo[], knownLanguages: readonly string[], rules: LegalRules): void {
	for (const { language } of files) {
		if (!knownLanguages.includes(language)) {
			throw new Error(
				`The legal page file "${pathOf(language)}" is not named after a language. ` +
					`Name it after one of these keys: ${knownLanguages.join(', ')}.`,
			);
		}
	}

	for (const required of rules.requiredLanguages) {
		if (!files.some((file) => file.language === required)) {
			throw new Error(`The legal page needs the file "${pathOf(required)}", but it does not exist.`);
		}
	}

	for (const { language, hasTranslationNote } of files) {
		const isTranslation = language !== rules.bindingLanguage;
		if (isTranslation && !hasTranslationNote) {
			throw new Error(
				`"${pathOf(language)}" is a translation. The version that counts legally is "${rules.bindingLanguage}". ` +
					'So the head of the file needs a "translationNote" with "text" and "linkText".',
			);
		}
		if (!isTranslation && hasTranslationNote) {
			throw new Error(
				`"${pathOf(language)}" is the version that counts legally. ` +
					'So the head of the file must not have a "translationNote".',
			);
		}
	}
}

/**
 * Stops the build if the text of a file has a heading of the first level,
 * written with one `#`. The page shows the `title` from the head of the file
 * as its only heading of that level.
 *
 * `headingLevels` are the levels of all headings in the text, in order.
 */
export function checkLegalHeadings(language: string, headingLevels: readonly number[]): void {
	if (headingLevels.includes(1)) {
		throw new Error(
			`The text of "${pathOf(language)}" has a heading with one "#". ` +
				'The page title comes from "title" in the head of the file. Start the headings in the text with "##".',
		);
	}
}

/**
 * The language of the legal page that a page in `language` links to: the same
 * language if its file exists, otherwise the version that counts legally.
 */
export function legalPageLanguage<Key extends string>(language: Key, fileLanguages: readonly string[], bindingLanguage: Key): Key {
	return fileLanguages.includes(language) ? language : bindingLanguage;
}
