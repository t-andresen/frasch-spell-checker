/**
 * The shape that both install pages share (LibreOffice and MS Word).
 */

/**
 * One numbered step. `screenshot` is the file name of its image and is optional.
 * A step with a screenshot needs an image description in every language.
 * A step without one must not have an image description.
 */
export type InstallStep = { id: string; screenshot?: string };

/** One note below the steps, for example how to update. */
export type InstallNote = { id: string };

/** Steps and notes appear on the page in the order of these lists. */
export type InstallPageStructure = {
	steps: readonly InstallStep[];
	notes: readonly InstallNote[];
};
