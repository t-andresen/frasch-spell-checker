/**
 * The types of all website text.
 *
 * The structure modules in `src/structure/` say which tiles, steps, notes and
 * sections exist. The types here are derived from them. So when a step is added
 * to a structure module, every language module fails the type check until it
 * supplies the text for that step.
 */
import type { aboutPage } from '../structure/about';
import type { InstallPageStructure, InstallStep } from '../structure/install';
import type { libreOfficePage } from '../structure/libreOffice';
import type { MenuPageId } from '../structure/pages';
import type { startPage } from '../structure/start';
import type { wordPage } from '../structure/word';

/**
 * Text that is shown exactly as written. Use it for titles, labels, button
 * text and image descriptions. Markup characters are not interpreted.
 */
export type Plain = string;

/**
 * Text that can contain emphasis and links in the small markup that
 * `src/lib/richText.ts` describes. Pages show it with the `RichText` component.
 */
export type Rich = string;

/** A heading with one paragraph of text below it. */
export type HeadingAndText = { heading: Plain; text: Rich };

/** Short texts that several pages share. */
export type LabelsText = {
	/** Link at the very top that jumps to the main content, for keyboard users. */
	skipLink: Plain;
	/** Name of the menu for screen readers. */
	menuName: Plain;
	/** The menu entries. */
	menu: Record<MenuPageId, Plain>;
	/** Name of the language switcher for screen readers. */
	languageSwitcherName: Plain;
	footer: {
		/** Link to the legal page. */
		legal: Plain;
		/** Link to the GitHub repo. */
		repo: Plain;
	};
	/** Shared by both install pages. */
	install: {
		/** Text of the download button. */
		download: Plain;
		/** Label in front of the version number. */
		version: Plain;
		/** Label in front of the date. */
		date: Plain;
		/** Text of the link that opens a screenshot in full size. */
		openScreenshot: Plain;
		/** Hint for phone visitors that the installation happens on a computer. */
		phoneHint: Rich;
	};
};

type StartTile = (typeof startPage)['tiles'][number];

export type StartPageText = {
	title: Plain;
	/** What the site offers. */
	intro: Rich;
	/** Which variety of North Frisian the spell checker covers. */
	variety: Rich;
	/** The clearly visible block: a helpful tool, not a standard. */
	toolNote: HeadingAndText;
	/** One large link card per program. The whole card is a link, so its text is plain. */
	tiles: { [Tile in StartTile as Tile['id']]: { title: Plain; text: Plain } };
	/** Note that Mac instructions are in preparation. */
	macNote: Rich;
	/** The "not supported" line. */
	notSupported: Rich;
};

/** A step with a screenshot needs an image description. A step without one must not have it. */
type StepText<Step extends InstallStep> = Step extends { screenshot: string }
	? { text: Rich; imageDescription: Plain }
	: { text: Rich };

export type InstallPageText<Structure extends InstallPageStructure> = {
	title: Plain;
	intro: Rich;
	/** One text per step of the structure. */
	steps: { [Step in Structure['steps'][number] as Step['id']]: StepText<Step> };
	/** The line that says which program version the screenshots show. */
	screenshotsNote: Rich;
	/** One heading and text per note of the structure. */
	notes: { [Note in Structure['notes'][number] as Note['id']]: HeadingAndText };
};

export type LibreOfficePageText = InstallPageText<typeof libreOfficePage> & {
	/** Text of the smaller link to the LibreOffice extension site. */
	extensionSiteLink: Plain;
};

export type WordPageText = InstallPageText<typeof wordPage>;

type AboutSection = (typeof aboutPage)['sections'][number];

export type AboutPageText = {
	title: Plain;
	intro: Rich;
	/** One heading and text per section of the structure. */
	sections: { [Section in AboutSection as Section['id']]: HeadingAndText };
	/** Extra texts of the feedback section. */
	feedback: {
		/** Text of the button that opens the mail program. */
		mailButton: Plain;
		/** Subject line that the mail starts with. */
		mailSubject: Plain;
		/** Text of the smaller link to the GitHub issues. */
		issuesLink: Plain;
	};
};

/** Everything one language has to supply. */
export type SiteText = {
	labels: LabelsText;
	start: StartPageText;
	libreOffice: LibreOfficePageText;
	word: WordPageText;
	about: AboutPageText;
};
