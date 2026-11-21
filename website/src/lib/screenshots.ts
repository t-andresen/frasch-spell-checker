/**
 * Finds the image for a screenshot that a structure module names, for example
 * `libreoffice-open-file.png` in `src/structure/libreOffice.ts`.
 *
 * The screenshots are PNG files in `src/screenshots/` (`screenshotsFolder` in
 * `src/structure/install.ts`). The build copies each one into the site and
 * knows its width and height. While a file is not there yet, the page shows a
 * neutral placeholder image from `public/`. `npm run check:launch` lists every
 * screenshot that is still missing.
 */
import type { ImageMetadata } from 'astro';
import { fileLink } from './links';

// Vite reads the folder while the site is built. The pattern must be written
// out here and cannot come from a variable. It must match `screenshotsFolder`.
const files = import.meta.glob<ImageMetadata>('../screenshots/*.png', { eager: true, import: 'default' });

/** An image to show for a step. */
export type ScreenshotImage = {
	/** Address of the image. The link to the full size leads here too. */
	src: string;
	width: number;
	height: number;
	/** True while the real screenshot does not exist yet. */
	isPlaceholder: boolean;
};

/** The placeholder image. Its size matches the `viewBox` of the file. */
const placeholder: ScreenshotImage = {
	src: fileLink('screenshot-placeholder.svg'),
	width: 1600,
	height: 1000,
	isPlaceholder: true,
};

/** Returns the image for a file name from a structure module, or the placeholder. */
export function getScreenshot(fileName: string): ScreenshotImage {
	const image = files[`../screenshots/${fileName}`];
	if (image === undefined) {
		return placeholder;
	}
	return { src: image.src, width: image.width, height: image.height, isPlaceholder: false };
}
