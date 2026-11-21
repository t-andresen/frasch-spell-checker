/**
 * The shape that both install pages share (LibreOffice and MS Word).
 *
 * Node runs this file directly for `check:launch`. So it must not import anything from Astro.
 */

/**
 * One numbered step. `screenshot` is the file name of its image and is optional.
 * A step with a screenshot needs an image description in every language.
 * A step without one must not have an image description.
 *
 * The screenshot files go into the folder `website/src/screenshots/`, as PNG.
 * While a file is not there, the page shows a neutral placeholder image, and
 * `npm run check:launch` lists the file as missing.
 */
export type InstallStep = { id: string; screenshot?: `${string}.png` };

/** One note below the steps, for example how to update. */
export type InstallNote = { id: string };

/** Steps and notes appear on the page in the order of these lists. */
export type InstallPageStructure = {
	steps: readonly InstallStep[];
	notes: readonly InstallNote[];
};

/** The folder of the screenshots, from the folder `website/`. */
export const screenshotsFolder = 'src/screenshots';
