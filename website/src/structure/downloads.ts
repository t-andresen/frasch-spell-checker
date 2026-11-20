/**
 * The download files of the site and where they come from.
 *
 * This is the only place that names the source files in `spell_check/`. The
 * build copies each file into the folder `downloads/` of the site, under its
 * `fileName`. The maintainer never uploads a file to the website separately.
 *
 * - `source`: path of the file, from the top folder of the repo.
 * - `fileName`: the name a visitor downloads.
 *
 * The keys are the ids of the install pages in `src/structure/pages.ts`.
 *
 * `build/integrations/downloads.ts` copies the files. `build/lib/release.ts` reads the
 * version and the date. Node runs this file directly for the tests. So it must
 * not import anything from Astro.
 */
export const downloads = {
	libreOffice: {
		source: 'spell_check/libre_office/mooring_spell_checker.oxt',
		fileName: 'mooring_spell_checker.oxt',
	},
	word: {
		source: 'spell_check/ms_word/Frasch.dic',
		fileName: 'Frasch.dic',
	},
} as const;

export type DownloadId = keyof typeof downloads;

/** The folder of the site that holds the downloads. */
export const downloadsFolder = 'downloads';

/** The folder of the repo that holds all spell check files. The date is the date of its last commit. */
export const spellCheckFolder = 'spell_check';

/**
 * Folders whose files are never published. The build stops when a `source`
 * above lies in one of them.
 */
export const unpublishedFolders = ['spell_check/hunspell', 'spell_check/apple_pages'] as const;

/**
 * The version number is read from this file inside the LibreOffice file.
 * A LibreOffice extension (`.oxt`) is a zip archive.
 */
export const versionSource = { download: 'libreOffice', entry: 'description.xml' } as const satisfies {
	download: DownloadId;
	entry: string;
};

/**
 * Path of a download inside the site, for example `downloads/Frasch.dic`.
 * Pages pass it to `fileLink()` from `src/lib/links.ts`.
 */
export function downloadPath(id: DownloadId): string {
	return `${downloadsFolder}/${downloads[id].fileName}`;
}
