import type { InstallPageStructure } from './install.ts';

/**
 * Structure of the LibreOffice install page.
 *
 * The steps are provisional. The final list comes out of issue 14.
 * The screenshot files do not exist yet. See `InstallStep` in `install.ts`.
 *
 * Node runs this file directly for `check:launch`. So it must not import anything from Astro.
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

/**
 * Address of the spell checker on the LibreOffice extension site
 * (extensions.libreoffice.org). The page shows a smaller link to it next to
 * the download button.
 *
 * Empty while the listing does not exist. Then the page shows no link.
 * The upload is issue 25. A value that is not empty must start with `https://`.
 */
export const extensionSiteAddress: string = '';
