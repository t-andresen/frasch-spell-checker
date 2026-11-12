import type { PageId } from './pages';

/** Where a link leads: to a page of this site, or to an address on another site. */
export type LinkTarget = { kind: 'page'; page: PageId } | { kind: 'external'; href: string };

/**
 * The links a text can contain. A text refers to a link by its name here,
 * for example `[text of the link](repo)`. A text never contains an address.
 * So a link leads to the same place in every language.
 *
 * To let a text link somewhere new, add a name here first.
 */
export const textLinks = {
	startPage: { kind: 'page', page: 'start' },
	libreOfficePage: { kind: 'page', page: 'libreOffice' },
	wordPage: { kind: 'page', page: 'word' },
	aboutPage: { kind: 'page', page: 'about' },
	repo: { kind: 'external', href: 'https://github.com/t-andresen/frasch-spell-checker' },
	issues: { kind: 'external', href: 'https://github.com/t-andresen/frasch-spell-checker/issues' },
	/** The digitised second edition (2002) of the Frasch Uurdebök at Kiel University Library. */
	dictionary: { kind: 'external', href: 'https://doi.org/10.38071/2025-01302-7' },
} as const satisfies Record<string, LinkTarget>;

export type TextLinkName = keyof typeof textLinks;

/** All link names, for the check of a text. */
export const textLinkNames = Object.keys(textLinks) as TextLinkName[];
