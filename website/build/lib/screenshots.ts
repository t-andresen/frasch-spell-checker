/**
 * Finds the screenshots that the structure modules name but that do not exist
 * yet. `build/scripts/check-launch.ts` reports them.
 *
 * Node runs this file directly for `check:launch` and for the tests. So it must
 * not import anything from Astro.
 */
import type { InstallPageStructure } from '../../src/structure/install.ts';

/** A screenshot that a step names, and the page and step that name it. */
export type MissingScreenshot = { page: string; step: string; file: string };

/**
 * Returns every screenshot of the pages whose file is not in `existingFiles`,
 * in the order of the pages and their steps.
 *
 * The comparison is exact, also in upper and lower case. On Windows a file
 * `Word-Add-File.png` would open as `word-add-file.png`, but the build would
 * not find it, and the page would show the placeholder.
 */
export function findMissingScreenshots(
	pages: Record<string, InstallPageStructure>,
	existingFiles: readonly string[],
): MissingScreenshot[] {
	const existing = new Set(existingFiles);
	return Object.entries(pages).flatMap(([page, structure]) =>
		structure.steps.flatMap((step) =>
			step.screenshot === undefined || existing.has(step.screenshot)
				? []
				: [{ page, step: step.id, file: step.screenshot }],
		),
	);
}
