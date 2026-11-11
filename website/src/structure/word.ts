import type { InstallPageStructure } from './install';

/**
 * Structure of the MS Word install page.
 *
 * The steps are provisional. The final list comes out of issue 15.
 * The screenshot files do not exist yet.
 */
export const wordPage = {
	steps: [
		{ id: 'download' },
		{ id: 'moveFile', screenshot: 'word-move-file.png' },
		{ id: 'openOptions', screenshot: 'word-open-options.png' },
		{ id: 'openCustomDictionaries', screenshot: 'word-open-custom-dictionaries.png' },
		{ id: 'addFile', screenshot: 'word-add-file.png' },
	],
	notes: [{ id: 'proofingLanguage' }, { id: 'check' }, { id: 'update' }, { id: 'browser' }],
} as const satisfies InstallPageStructure;
