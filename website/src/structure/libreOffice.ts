import type { InstallPageStructure } from './install';

/**
 * Structure of the LibreOffice install page.
 *
 * The steps are provisional. The final list comes out of issue 14.
 * The screenshot files do not exist yet.
 */
export const libreOfficePage = {
	steps: [
		{ id: 'download' },
		{ id: 'openFile', screenshot: 'libreoffice-open-file.png' },
		{ id: 'confirmInstall', screenshot: 'libreoffice-confirm-install.png' },
		{ id: 'restart' },
		{ id: 'selectLanguage', screenshot: 'libreoffice-select-language.png' },
	],
	notes: [{ id: 'check' }, { id: 'update' }],
} as const satisfies InstallPageStructure;
