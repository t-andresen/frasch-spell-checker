/**
 * Runs the checks of the built site at the end of every `astro build`.
 *
 * An Astro integration is a set of functions that Astro calls at fixed moments.
 * This one uses two moments: when the settings are final, to read `site` and
 * `base`, and when the build is written, to check the files. The checks
 * themselves are in `src/lib/siteCheck.ts`.
 *
 * A problem stops the build with an error. So `npm run build` fails on the
 * maintainer's computer and in the GitHub workflow in the same way.
 */
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { checkBuildFolder } from '../src/lib/siteCheck';

export function siteCheck(): AstroIntegration {
	let site: string | undefined;
	let base = '/';

	return {
		name: 'site-check',
		hooks: {
			'astro:config:done': ({ config }) => {
				site = config.site;
				base = config.base;
			},
			'astro:build:done': ({ dir, logger }) => {
				if (site === undefined) {
					throw new Error('The site check needs `site` in astro.config.ts to tell internal addresses from other servers.');
				}

				const { problems, fileCount } = checkBuildFolder(fileURLToPath(dir), site, base);
				if (problems.length === 0) {
					logger.info(`Checked ${fileCount} files: all links and files are fine, nothing loads from another server, no JavaScript.`);
					return;
				}

				for (const { file, message } of problems) {
					logger.error(`${file}: ${message}`);
				}
				throw new Error(`The site check found ${problems.length} problem(s) in the built site. They are listed above.`);
			},
		},
	};
}
