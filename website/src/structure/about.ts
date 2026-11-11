type AboutPageStructure = {
	sections: readonly { id: string }[];
};

/**
 * Structure of the About page.
 *
 * `sections` appear on the page in this order. Every language supplies a
 * heading and a text for each section `id`.
 *
 * - `words`: where the words come from and what was changed
 * - `gaps`: what the spell checker does not cover yet
 * - `feedback`: how to report a missing or wrong word
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
		{ id: 'credits' },
		{ id: 'developers' },
	],
} as const satisfies AboutPageStructure;
