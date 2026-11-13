import type { TextLinkName } from './textLinks';

type AboutPageStructure = {
	sections: readonly { id: string; mustLinkTo?: TextLinkName }[];
};

/**
 * Structure of the About page.
 *
 * `sections` appear on the page in this order. Every language supplies a
 * heading and a text for each section `id`.
 *
 * `mustLinkTo` names a link from `textLinks.ts` that the text of the section
 * must contain. The build stops if a language has written the text without
 * that link. So a link cannot be missing in one language.
 *
 * - `words`: where the words come from and what was changed
 * - `gaps`: what the spell checker does not cover yet
 * - `feedback`: how to report a missing or wrong word. The page adds the mail
 *   button and the link to the GitHub issues below the text.
 * - `license`: one sentence about the license
 * - `credits`: credits for the North Frisian Dictionary Unit at Kiel University
 * - `developers`: one line that links to the repo with the Hunspell files
 */
export const aboutPage = {
	sections: [
		{ id: 'words' },
		{ id: 'gaps' },
		{ id: 'feedback' },
		{ id: 'license' },
		{ id: 'credits', mustLinkTo: 'dictionary' },
		{ id: 'developers', mustLinkTo: 'repo' },
	],
} as const satisfies AboutPageStructure;
