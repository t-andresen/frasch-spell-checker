/**
 * Checks of the built site, the files in `dist/`.
 *
 * The checks read the finished HTML and CSS files, so they see what a visitor's
 * browser sees. They report:
 *
 * - an internal link to a page or to a place on a page that does not exist
 * - an image, download or other file of this site that does not exist
 * - anything the browser would load from another server: script, stylesheet,
 *   font, image, frame. A normal link to another site is allowed.
 * - JavaScript: a `<script>` tag, an attribute like `onclick`, a `javascript:` address
 *
 * `integrations/siteCheck.ts` runs the checks at the end of every `npm run build`.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'parse5';
import type { DefaultTreeAdapterTypes } from 'parse5';

type Node = DefaultTreeAdapterTypes.Node;
type Element = DefaultTreeAdapterTypes.Element;

/** One thing that is wrong, and the built file that contains it. */
export type Problem = { file: string; message: string };

export type SiteCheckInput = {
	/** Address of the server, `site` in `astro.config.ts`. */
	site: string;
	/** Folder of the site on that server, `base` in `astro.config.ts`. */
	base: string;
	/** Every file of the build, as a path inside the build folder with forward slashes. */
	files: readonly string[];
	/** Returns the content of one HTML or CSS file from `files`. */
	read: (file: string) => string;
};

/**
 * An address that a page or a stylesheet contains.
 *
 * - `link`: the visitor decides to follow it. It may lead to another site.
 * - `resource`: the browser loads it on its own. It must be a file of this site.
 */
type Reference = { kind: 'link' | 'resource'; address: string; source: string };

type ParsedPage = {
	/** Values of all `id` attributes, the places a link with `#` can lead to. */
	ids: Set<string>;
	references: Reference[];
	/** Problems that need no look at other files, for example a `<script>` tag. */
	messages: string[];
	/** Value of `<base href>`, if the page has one. It changes how relative addresses resolve. */
	baseHref: string | undefined;
};

/** Attributes whose address the browser loads on its own, per tag name in lower case. */
const resourceAttributes: Record<string, readonly string[]> = {
	audio: ['src'],
	body: ['background'],
	embed: ['src'],
	feimage: ['href'],
	frame: ['src'],
	iframe: ['src'],
	image: ['href'],
	img: ['src', 'srcset'],
	input: ['src'],
	object: ['data'],
	script: ['src'],
	source: ['src', 'srcset'],
	track: ['src'],
	use: ['href'],
	video: ['src', 'poster'],
};

/** Attributes whose address the visitor follows, per tag name in lower case. */
const linkAttributes: Record<string, readonly string[]> = {
	a: ['href'],
	area: ['href'],
	form: ['action'],
};

/**
 * Values of `rel` on a `<link>` tag that only name a related page. The browser
 * loads nothing for them. For every other value, for example `stylesheet`,
 * `icon` or `preconnect`, the browser contacts the address.
 */
const relValuesThatLoadNothing = ['alternate', 'author', 'canonical', 'help', 'license', 'me', 'next', 'prev', 'search'];

/** `<meta>` tags for previews on other sites. Their content is the address of a page or image. */
const metaNamesWithAddress = ['og:image', 'og:image:url', 'og:image:secure_url', 'og:url', 'twitter:image', 'twitter:image:src'];

/** Attributes that hold a list of image addresses with sizes. */
const imageListAttributes = ['srcset', 'imagesrcset'];

function attribute(element: Element, name: string): string | undefined {
	return element.attrs.find((candidate) => candidate.name === name)?.value;
}

/** The element and all elements inside it, in document order. */
function* elementsIn(node: Node): Generator<Element> {
	if ('tagName' in node) {
		yield node;
	}
	// The parser keeps the inside of a `<template>` tag in `content`.
	if ('content' in node) {
		yield* elementsIn(node.content);
	}
	if ('childNodes' in node) {
		for (const child of node.childNodes) {
			yield* elementsIn(child);
		}
	}
}

function textIn(element: Element): string {
	return element.childNodes.map((child) => ('value' in child ? child.value : '')).join('');
}

/**
 * Addresses in a list like `small.png 1x, large.png 2x`. A comma belongs to an
 * address when no space follows the address. That keeps `data:` addresses whole.
 */
export function findImageListAddresses(list: string): string[] {
	const addresses: string[] = [];
	let rest = list;
	for (;;) {
		rest = rest.replace(/^[\s,]+/, '');
		const written = /^\S+/.exec(rest)?.[0];
		if (written === undefined) {
			return addresses;
		}
		rest = rest.slice(written.length);

		const address = written.replace(/,+$/, '');
		addresses.push(address);
		if (address === written) {
			// No comma directly after the address. So a size follows, up to the next comma.
			const comma = rest.indexOf(',');
			rest = comma === -1 ? '' : rest.slice(comma + 1);
		}
	}
}

/**
 * Addresses that a piece of CSS loads: every `url(...)` and every `@import "..."`.
 * This is a text search and no full CSS parser. It can report an address that
 * only appears inside a quoted text, which is the safe side for a check.
 */
export function findCssAddresses(css: string): string[] {
	const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, ' ');
	const pattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'()\s]*))\s*\)|@import\s+(?:"([^"]*)"|'([^']*)')/gi;
	const addresses: string[] = [];
	for (const match of withoutComments.matchAll(pattern)) {
		const address = match.slice(1).find((group) => group !== undefined) ?? '';
		if (address.trim() !== '') {
			addresses.push(address);
		}
	}
	return addresses;
}

function cssReferences(css: string, source: string): Reference[] {
	return findCssAddresses(css).map((address) => ({ kind: 'resource', address, source: `${source}: url(${address})` }));
}

/** The address in `<meta http-equiv="refresh" content="0; url=/somewhere/">`. */
function refreshAddress(content: string): string | undefined {
	return /url\s*=\s*["']?([^"']*)/i.exec(content)?.[1];
}

function parsePage(html: string): ParsedPage {
	// With `scriptingEnabled: false` the parser also reads the tags inside `<noscript>`.
	const document = parse(html, { scriptingEnabled: false });
	const page: ParsedPage = { ids: new Set(), references: [], messages: [], baseHref: undefined };

	for (const element of elementsIn(document)) {
		const tag = element.tagName.toLowerCase();
		const describe = (name: string) => `<${tag} ${name}="${attribute(element, name) ?? ''}">`;
		const add = (kind: Reference['kind'], name: string) => {
			const value = attribute(element, name);
			if (value === undefined) {
				return;
			}
			const addresses = imageListAttributes.includes(name) ? findImageListAddresses(value) : [value];
			for (const address of addresses) {
				page.references.push({ kind, address, source: describe(name) });
			}
		};

		const id = attribute(element, 'id');
		if (id !== undefined) {
			page.ids.add(id);
		}

		if (tag === 'script') {
			page.messages.push('The page contains a <script> tag. The site works without JavaScript.');
		}
		for (const { name } of element.attrs) {
			if (/^on[a-z]+$/.test(name)) {
				page.messages.push(`${describe(name)} runs JavaScript. The site works without JavaScript.`);
			}
		}

		const style = attribute(element, 'style');
		if (style !== undefined) {
			page.references.push(...cssReferences(style, `<${tag} style>`));
		}

		for (const name of resourceAttributes[tag] ?? []) {
			add('resource', name);
		}
		for (const name of linkAttributes[tag] ?? []) {
			add('link', name);
		}

		switch (tag) {
			case 'a': {
				// An old way to mark a place on a page, next to `id`.
				const name = attribute(element, 'name');
				if (name !== undefined) {
					page.ids.add(name);
				}
				// The browser sends a request to every address in `ping` when the visitor follows the link.
				for (const address of (attribute(element, 'ping') ?? '').split(/\s+/).filter((part) => part !== '')) {
					page.references.push({ kind: 'resource', address, source: describe('ping') });
				}
				break;
			}
			case 'base':
				page.baseHref ??= attribute(element, 'href');
				break;
			case 'link': {
				const rel = (attribute(element, 'rel') ?? '').toLowerCase().split(/\s+/).filter((part) => part !== '');
				const loadsNothing = rel.length > 0 && rel.every((value) => relValuesThatLoadNothing.includes(value));
				add(loadsNothing ? 'link' : 'resource', 'href');
				add('resource', 'imagesrcset');
				break;
			}
			case 'meta': {
				const content = attribute(element, 'content') ?? '';
				if (attribute(element, 'http-equiv')?.toLowerCase() === 'refresh') {
					const address = refreshAddress(content);
					if (address !== undefined) {
						page.references.push({ kind: 'link', address, source: describe('content') });
					}
				}
				const name = (attribute(element, 'property') ?? attribute(element, 'name') ?? '').toLowerCase();
				if (metaNamesWithAddress.includes(name)) {
					page.references.push({ kind: 'link', address: content, source: describe('content') });
				}
				break;
			}
			case 'style':
				page.references.push(...cssReferences(textIn(element), '<style>'));
				break;
		}
	}
	return page;
}

/**
 * Checks a built site and returns everything that is wrong. An empty list means
 * that all checks passed.
 */
export function checkSite(input: SiteCheckInput): Problem[] {
	const origin = new URL(input.site).origin;
	const baseSegments = input.base.split('/').filter((segment) => segment !== '');
	// The folder of the site with a slash at both ends, or a single slash for no folder.
	const basePath = baseSegments.length === 0 ? '/' : `/${baseSegments.join('/')}/`;

	const files = [...input.files].sort();
	const fileSet = new Set(files);
	const htmlFiles = files.filter((file) => file.endsWith('.html'));
	const cssFiles = files.filter((file) => file.endsWith('.css'));
	const pages = new Map(htmlFiles.map((file) => [file, parsePage(input.read(file))]));
	const problems: Problem[] = [];

	/** The address a visitor's browser uses for a built file. */
	function addressOf(file: string): string {
		const path = file === 'index.html' || file.endsWith('/index.html') ? file.slice(0, -'index.html'.length) : file;
		return origin + basePath + path.split('/').map(encodeURIComponent).join('/');
	}

	/** Returns what is wrong with one address, or `undefined` if it is fine. */
	function check(reference: Reference, fromAddress: string): string | undefined {
		const { kind, source } = reference;
		const address = reference.address.trim();

		let url: URL;
		try {
			url = new URL(address, fromAddress);
		} catch {
			return `${source} is not a valid address.`;
		}

		if (url.protocol === 'javascript:') {
			return `${source} runs JavaScript. The site works without JavaScript.`;
		}
		if (url.protocol === 'data:') {
			// The content is part of the address. The browser contacts no server.
			return undefined;
		}

		const onThisServer = url.origin === origin;
		const writtenInFull = /^[a-z][a-z0-9+.-]*:/i.test(address);

		let path: string;
		try {
			path = decodeURIComponent(url.pathname);
		} catch {
			return `${source} is not a valid address.`;
		}
		const noSlashMessage = `${source} leads to a page, but has no slash at the end. The address of a page ends with a slash.`;
		// The address of the start page without its slash, for example "/frasch-spell-checker".
		if (onThisServer && `${path}/` === basePath) {
			return noSlashMessage;
		}
		const inSiteFolder = onThisServer && path.startsWith(basePath);

		if (kind === 'link' && (!onThisServer || (writtenInFull && !inSiteFolder))) {
			// A normal link to another site, or an address like `mailto:`.
			return undefined;
		}
		if (!onThisServer) {
			return `${source} loads a file from another server. The site loads nothing from other servers.`;
		}
		if (!inSiteFolder) {
			return (
				`${source} leads outside the folder of the site, "${basePath}". ` +
				'Build an internal address with pageLink() or fileLink() from src/lib/links.ts.'
			);
		}

		const pathInBuild = path.slice(basePath.length);
		const isFolder = pathInBuild === '' || pathInBuild.endsWith('/');
		const target = isFolder ? `${pathInBuild}index.html` : pathInBuild;

		if (!fileSet.has(target)) {
			if (isFolder) {
				return `${source} leads to a page that does not exist.`;
			}
			if (fileSet.has(`${pathInBuild}/index.html`)) {
				return noSlashMessage;
			}
			return `${source} leads to a file that does not exist. Upper and lower case must match.`;
		}

		let place: string;
		try {
			place = decodeURIComponent(url.hash.slice(1));
		} catch {
			return `${source} is not a valid address.`;
		}
		// An empty place and "top" both mean the top of the page. A place that
		// starts with ":~:" marks a text on the page and needs no `id`.
		const needsId = place !== '' && place.toLowerCase() !== 'top' && !place.startsWith(':~:');
		const targetPage = pages.get(target);
		if (needsId && targetPage !== undefined && !targetPage.ids.has(place)) {
			return `${source} leads to the place "#${place}", but that page has no element with this id.`;
		}
		return undefined;
	}

	if (htmlFiles.length === 0) {
		problems.push({ file: '.', message: 'The build folder contains no page. So there is nothing to check.' });
	}

	for (const [file, page] of pages) {
		const messages = [...page.messages];

		let fromAddress = addressOf(file);
		if (page.baseHref !== undefined) {
			try {
				fromAddress = new URL(page.baseHref, fromAddress).href;
			} catch {
				messages.push(`<base href="${page.baseHref}"> is not a valid address.`);
			}
		}

		for (const reference of page.references) {
			const message = check(reference, fromAddress);
			if (message !== undefined) {
				messages.push(message);
			}
		}
		// A link in the menu appears once per page. Report each problem once per file.
		problems.push(...[...new Set(messages)].map((message) => ({ file, message })));
	}

	for (const file of cssFiles) {
		const messages = cssReferences(input.read(file), 'CSS').flatMap((reference) => check(reference, addressOf(file)) ?? []);
		problems.push(...[...new Set(messages)].map((message) => ({ file, message })));
	}

	return problems;
}

/** Runs `checkSite` on a build folder on disk, for example `dist/`. */
export function checkBuildFolder(folder: string, site: string, base: string): { problems: Problem[]; fileCount: number } {
	const files = readdirSync(folder, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile())
		.map((entry) => relative(folder, join(entry.parentPath, entry.name)).replaceAll('\\', '/'));

	const problems = checkSite({ site, base, files, read: (file) => readFileSync(join(folder, file), 'utf8') });
	return { problems, fileCount: files.length };
}
