import { getLanguage, type LanguageKey } from '../i18n/languages';
import { getPage } from '../structure/pages';
import type { LinkTarget } from '../structure/textLinks';

// Astro fills `import.meta.env.BASE_URL` from `base`. Normalise it to end with one slash.
const base = `${import.meta.env.BASE_URL.replace(/\/+$/, '')}/`;

/**
 * Address of a page in one language, for example `pageLink('de', 'libreoffice')`.
 * Leave `page` empty for the start page. The result always ends with a slash.
 */
export function pageLink(language: LanguageKey, page = ''): string {
	const segments = [getLanguage(language).prefix, ...page.split('/')];
	return base + segments.filter((segment) => segment !== '').map((segment) => `${segment}/`).join('');
}

/**
 * Address of a file that has no language, for example a download in `public/`.
 * Unlike `pageLink`, the result has no slash at the end.
 */
export function fileLink(path: string): string {
	return base + path.replace(/^\/+/, '');
}

/**
 * Address of a link target from `src/structure/textLinks.ts`.
 * A page target leads to that page in the given language.
 */
export function targetLink(language: LanguageKey, target: LinkTarget): string {
	switch (target.kind) {
		case 'page':
			return pageLink(language, getPage(target.page).slug);
		case 'external':
			return target.href;
	}
}
