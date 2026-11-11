/**
 * The pages of the site. This is the only place that lists them.
 *
 * - `id`: the internal name. Text modules and links use it.
 * - `slug`: the part of the address after the language, for example `libreoffice`
 *   in `/de/libreoffice/`. It is the same in every language. Empty for the start page.
 * - `inMenu`: whether the page has an entry in the menu. The menu shows the
 *   pages in the order of this list.
 */
export const pages = [
	{ id: 'start', slug: '', inMenu: true },
	{ id: 'libreOffice', slug: 'libreoffice', inMenu: true },
	{ id: 'word', slug: 'word', inMenu: true },
	{ id: 'about', slug: 'about', inMenu: true },
	{ id: 'legal', slug: 'legal', inMenu: false },
] as const;

export type Page = (typeof pages)[number];
export type PageId = Page['id'];

type MenuPage = Extract<Page, { inMenu: true }>;
export type MenuPageId = MenuPage['id'];

/** The pages of the menu, in display order. */
export const menuPages = pages.filter((page): page is MenuPage => page.inMenu);

/** Returns the page for an id. */
export function getPage(id: PageId): Page {
	const page = pages.find((candidate) => candidate.id === id);
	if (!page) {
		throw new Error(`Unknown page id "${id}".`);
	}
	return page;
}
