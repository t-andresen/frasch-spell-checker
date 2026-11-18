/**
 * Reads what the site says about the current spell checker: the version
 * number and the date. It also checks that every download file exists.
 *
 * - The version comes from `<version value="...">` in `description.xml`
 *   inside the LibreOffice file.
 * - The date is the date of the last git commit that changed `spell_check/`.
 *   The build date would change with every fix of the website, so it is not used.
 *
 * Every problem throws an error with a message that names the file. So a
 * missing file or an unreadable version stops the build.
 *
 * The files and folders are named in `src/structure/downloads.ts`.
 * `build/integrations/downloads.ts` calls `readRelease` during the build.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { type DownloadId, downloadPath, downloads, spellCheckFolder, unpublishedFolders, versionSource } from '../../src/structure/downloads.ts';
import { readZipEntry } from './zip.ts';

/** One file to copy: from the repo into the site. */
export type DownloadFile = { id: DownloadId; source: string; target: string };

export type Release = {
	/** The version number, for example `1.2.0`. */
	version: string;
	/** Date of the last commit that changed the spell check files, as `YYYY-MM-DD`. */
	date: string;
	files: DownloadFile[];
};

/** All problems of this module start with this text, so the build output shows where they come from. */
const prefix = 'Downloads:';

/** Returns the version number from the text of a `description.xml`. Throws unless there is exactly one non-empty entry. */
export function readVersion(xml: string): string {
	const values = [...xml.matchAll(/<version\s+value="([^"]*)"/g)].map((match) => match[1]?.trim() ?? '');
	if (values.length !== 1 || values[0] === '') {
		throw new Error(`it needs exactly one non-empty <version value="..."> entry, but has ${values.length === 1 ? 'an empty one' : values.length}.`);
	}
	return values[0] as string;
}

function git(repoRoot: string, args: string[]): string {
	try {
		return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
	} catch (error) {
		const details = String((error as { stderr?: unknown }).stderr ?? (error as Error).message).trim();
		throw new Error(`${prefix} "git ${args.join(' ')}" failed in ${repoRoot}: ${details}`);
	}
}

/**
 * Returns the date of the last commit that changed `folder`, as `YYYY-MM-DD`,
 * in the time zone of the commit. So it does not depend on the build computer.
 *
 * A shallow clone, for example the default checkout in GitHub Actions, has
 * only the newest commit. There the date would silently be wrong, so it throws.
 */
export function readCommitDate(repoRoot: string, folder: string): string {
	if (git(repoRoot, ['rev-parse', '--is-shallow-repository']) === 'true') {
		throw new Error(
			`${prefix} the git history is incomplete (a shallow clone), so the date of the last change in ${folder}/ cannot be found. ` +
				'Run "git fetch --unshallow". In GitHub Actions, set "fetch-depth: 0" for actions/checkout.',
		);
	}
	const date = git(repoRoot, ['log', '-1', '--format=%cI', '--', folder]).slice(0, 10);
	if (date === '') {
		throw new Error(`${prefix} no git commit changed ${folder}/. So the date of the spell check files cannot be found.`);
	}
	return date;
}

/** Throws when a download file is missing or lies in a folder that is never published. */
function checkFile(repoRoot: string, id: DownloadId, source: string): void {
	const where = `It is the download "${id}" in src/structure/downloads.ts.`;
	const unpublished = unpublishedFolders.find((folder) => source.startsWith(`${folder}/`));
	if (unpublished !== undefined) {
		throw new Error(`${prefix} ${source} is in ${unpublished}/, whose files are never published. ${where}`);
	}
	if (statSync(join(repoRoot, source), { throwIfNoEntry: false })?.isFile() !== true) {
		throw new Error(`${prefix} the file ${source} does not exist. ${where}`);
	}
}

/** Returns the version number from the LibreOffice file. */
function readReleaseVersion(repoRoot: string): string {
	const source = downloads[versionSource.download].source;
	const where = `${versionSource.entry} in ${source}`;
	try {
		const xml = readZipEntry(readFileSync(join(repoRoot, source)), versionSource.entry);
		if (xml === undefined) {
			throw new Error('the file is missing.');
		}
		return readVersion(xml.toString('utf8'));
	} catch (error) {
		throw new Error(`${prefix} cannot read the version number from ${where}: ${(error as Error).message}`);
	}
}

/**
 * Checks the download files and reads version and date.
 * `repoRoot` is the top folder of the repo, the one that holds `spell_check/`.
 */
export function readRelease(repoRoot: string): Release {
	const files = (Object.keys(downloads) as DownloadId[]).map((id) => {
		const { source } = downloads[id];
		checkFile(repoRoot, id, source);
		return { id, source: join(repoRoot, source), target: downloadPath(id) };
	});
	return {
		version: readReleaseVersion(repoRoot),
		date: readCommitDate(repoRoot, spellCheckFolder),
		files,
	};
}
