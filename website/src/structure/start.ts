import type { PageId } from './pages';

type StartPageStructure = {
	tiles: readonly { id: string; page: PageId }[];
};

/**
 * Structure of the start page.
 *
 * `tiles` are the large link cards, in display order. Each one leads to `page`.
 * Every language supplies a title and a text for each tile `id`.
 */
export const startPage = {
	tiles: [
		{ id: 'libreOffice', page: 'libreOffice' },
		{ id: 'word', page: 'word' },
	],
} as const satisfies StartPageStructure;
