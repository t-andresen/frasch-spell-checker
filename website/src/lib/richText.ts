/**
 * The small markup that website text can contain.
 *
 *   *text*              emphasis
 *   **text**            strong emphasis
 *   [text](linkName)    a link. `linkName` is a name from `src/structure/textLinks.ts`,
 *                       never an address.
 *   \* \[ \] \\         a literal character. In a TypeScript string, write the
 *                       backslash twice: '\\*'.
 *
 * Nothing else has a meaning. HTML in a text is shown as plain characters.
 *
 * The parser is strict. A marker without its closing partner or an unknown link
 * name throws an error, so the build stops instead of publishing a broken text.
 * A placeholder passes through unchanged, although it contains square brackets.
 *
 * Node runs this file directly for the tests. So it must not import anything
 * from Astro, and its imports end in `.ts`.
 */
import { placeholderAt } from './placeholders.ts';

export type RichTextNode<LinkName extends string = string> =
	| { type: 'text'; value: string }
	| { type: 'emphasis'; children: RichTextNode<LinkName>[] }
	| { type: 'strong'; children: RichTextNode<LinkName>[] }
	| { type: 'link'; name: LinkName; children: RichTextNode<LinkName>[] };

/** The markers that are open at the current position. */
type Inside = { emphasis: boolean; strong: boolean; link: boolean };

/** The marker that ends the part the parser is reading. `undefined` at the top level. */
type Closer = '*' | '**' | ']' | undefined;

const linkNamePattern = /^\(([A-Za-z][A-Za-z0-9]*)\)/;

/**
 * Turns a text into a tree of nodes. Throws if the markup is wrong or if a
 * link name is not in `linkNames`.
 */
export function parseRichText<LinkName extends string>(
	source: string,
	linkNames: readonly LinkName[],
): RichTextNode<LinkName>[] {
	let position = 0;

	function problem(message: string, at = position): Error {
		return new Error(`Markup error at character ${at + 1}: ${message}\nText: ${source}`);
	}

	function parseUntil(closer: Closer, inside: Inside): RichTextNode<LinkName>[] {
		const nodes: RichTextNode<LinkName>[] = [];
		let plain = '';
		const flush = () => {
			if (plain !== '') {
				nodes.push({ type: 'text', value: plain });
				plain = '';
			}
		};

		while (position < source.length) {
			const character = source[position];

			if (character === '\\') {
				const next = source[position + 1];
				if (next === undefined || !'\\*[]'.includes(next)) {
					throw problem('A backslash must be followed by one of these characters: \\ * [ ]');
				}
				plain += next;
				position += 2;
				continue;
			}

			const placeholder = placeholderAt(source, position);
			if (placeholder !== undefined) {
				plain += placeholder;
				position += placeholder.length;
				continue;
			}

			if (character === '*') {
				const isDouble = source.startsWith('**', position);

				// Does this marker close the part we are reading? In "**a *b***" the
				// emphasis ends at the first of the three stars, the strong part at the other two.
				const closesEmphasis = closer === '*' && (!isDouble || inside.strong);
				const closesStrong = closer === '**' && isDouble;
				if (closesEmphasis || closesStrong) {
					flush();
					return nodes;
				}

				const marker = isDouble ? '**' : '*';
				const type = isDouble ? 'strong' : 'emphasis';
				if (inside[type]) {
					throw problem(`This ${marker} does not fit. Close markers in the reverse order of opening them.`);
				}
				flush();
				const start = position;
				position += marker.length;
				const children = parseUntil(marker, { ...inside, [type]: true });
				if (!source.startsWith(marker, position)) {
					throw problem(`This ${marker} has no closing ${marker}. Write \\* for a literal star.`, start);
				}
				if (children.length === 0) {
					throw problem(`There is no text between this ${marker} and the next one.`, start);
				}
				position += marker.length;
				nodes.push({ type, children });
				continue;
			}

			if (character === '[') {
				if (inside.link) {
					throw problem('A link cannot contain another link.');
				}
				flush();
				const start = position;
				position += 1;
				const children = parseUntil(']', { ...inside, link: true });
				if (source[position] !== ']') {
					throw problem('This [ has no closing ]. Write \\[ for a literal bracket.', start);
				}
				if (children.length === 0) {
					throw problem('This link has no text.', start);
				}
				position += 1;
				const target = linkNamePattern.exec(source.slice(position));
				if (!target) {
					throw problem('After the ] of a link comes its name in round brackets, for example (repo).');
				}
				const name = target[1] as LinkName;
				if (!linkNames.includes(name)) {
					throw problem(`Unknown link name "${name}". Known names: ${linkNames.join(', ')}.`);
				}
				position += target[0].length;
				nodes.push({ type: 'link', name, children });
				continue;
			}

			if (character === ']') {
				if (closer === ']') {
					flush();
					return nodes;
				}
				throw problem(
					inside.link
						? 'Close the emphasis before the ] of the link.'
						: 'This ] has no [ before it. Write \\] for a literal bracket.',
				);
			}

			plain += character;
			position += 1;
		}

		flush();
		return nodes;
	}

	return parseUntil(undefined, { emphasis: false, strong: false, link: false });
}

/** Replaces the characters that have a meaning in HTML. */
export function escapeHtml(text: string): string {
	return text
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/**
 * Turns the nodes into HTML. All text and all addresses are escaped, so the
 * result contains only the tags `em`, `strong` and `a`.
 * `linkAddress` returns the address for a link name.
 */
export function richTextToHtml<LinkName extends string>(
	nodes: readonly RichTextNode<LinkName>[],
	linkAddress: (name: LinkName) => string,
): string {
	return nodes
		.map((node) => {
			if (node.type === 'text') {
				return escapeHtml(node.value);
			}
			const inner = richTextToHtml(node.children, linkAddress);
			switch (node.type) {
				case 'emphasis':
					return `<em>${inner}</em>`;
				case 'strong':
					return `<strong>${inner}</strong>`;
				case 'link':
					return `<a href="${escapeHtml(linkAddress(node.name))}">${inner}</a>`;
			}
		})
		.join('');
}
