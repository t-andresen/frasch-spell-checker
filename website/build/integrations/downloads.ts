/**
 * Puts the download files into the site and gives the pages version and date.
 *
 * - Build: copies the files from `spell_check/` into `downloads/` of the built
 *   site. Only the files in `src/structure/downloads.ts` are copied.
 * - Local preview (`npm run dev`): serves the same files at the same addresses,
 *   straight from `spell_check/`.
 * - Pages: get version and date from a module that exists only during the build:
 *
 *     import { version, date } from 'virtual:release';
 *
 *   `date` has the form `YYYY-MM-DD`. Show it with `formatDate(date, language)` from
 *   `src/lib/formatDate.ts`.
 *
 * A missing file, an unreadable version or a missing date stops the build
 * with a message that names the file. The reading is in `build/lib/release.ts`.
 */
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { type Release, readRelease } from '../lib/release';

const moduleId = 'virtual:release';
// Vite's convention: a leading null character marks a module that has no file.
const resolvedModuleId = `\0${moduleId}`;

const moduleTypes = `declare module '${moduleId}' {
	/** The version number from description.xml in the LibreOffice file, for example "1.2.0". */
	export const version: string;
	/** Date of the last commit that changed spell_check/, as "YYYY-MM-DD". Show it with formatDate(). */
	export const date: string;
}
`;

export function downloads(): AstroIntegration {
	let repoRoot = '';
	let base = '/';
	let release: Release | undefined;

	/** Reads the files once. A problem throws and stops the build or the preview. */
	function getRelease(): Release {
		release ??= readRelease(repoRoot);
		return release;
	}

	return {
		name: 'downloads',
		hooks: {
			'astro:config:setup': ({ config, command, updateConfig }) => {
				// The website lives in `website/`. Its parent is the top folder of the repo.
				repoRoot = fileURLToPath(new URL('../', config.root));
				base = `${config.base.replace(/\/+$/, '')}/`;

				// Check the files right at the start, so a problem shows before any page is built.
				if (command === 'build' || command === 'dev') {
					getRelease();
				}

				updateConfig({
					vite: {
						plugins: [
							{
								name: 'release-module',
								resolveId(id) {
									return id === moduleId ? resolvedModuleId : undefined;
								},
								load(id) {
									if (id !== resolvedModuleId) {
										return undefined;
									}
									const { version, date } = getRelease();
									return `export const version = ${JSON.stringify(version)};\nexport const date = ${JSON.stringify(date)};\n`;
								},
							},
						],
					},
				});
			},

			'astro:config:done': ({ injectTypes }) => {
				injectTypes({ filename: 'release.d.ts', content: moduleTypes });
			},

			'astro:server:setup': ({ server }) => {
				const files = new Map(getRelease().files.map((file) => [`${base}${file.target}`, file]));
				server.middlewares.use((request, response, next) => {
					// Astro removes `base` from `url` before this runs. `originalUrl` still has it.
					const address = request.originalUrl ?? request.url ?? '';
					const file = files.get(address.split(/[?#]/)[0] ?? '');
					if (file === undefined) {
						next();
						return;
					}
					// Read on every request, so the preview always serves the current file.
					response.setHeader('Content-Type', 'application/octet-stream');
					response.end(readFileSync(file.source));
				});
			},

			// Runs once all pages are written, before `astro:build:done`, where the site check looks at the files.
			'astro:build:generated': ({ dir, logger }) => {
				const buildFolder = fileURLToPath(dir);
				const { files, version, date } = getRelease();
				for (const file of files) {
					const target = join(buildFolder, file.target);
					mkdirSync(dirname(target), { recursive: true });
					copyFileSync(file.source, target);
				}
				logger.info(`Copied ${files.length} download files. Version ${version}, date ${date}.`);
			},
		},
	};
}
