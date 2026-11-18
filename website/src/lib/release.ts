/**
 * Reads what the site says about the current spell checker: the version
 * number and the date. It also checks that every download file exists.
 *
 * - The version comes from `<version value="...">` in `description.xml`
 *   inside the LibreOffice file.
 * - The date is the date of the last git commit that changed `spell_check/`.
 *
 * Every problem throws an error with a message that names the file. So a
 * missing file or an unreadable version stops the build.
 *
 * The files and folders are named in `src/structure/downloads.ts`.
 * `integrations/downloads.ts` calls `readRelease` during the build.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { type DownloadId, downloadPath, downloads, spellCheckFolder, unpublishedFolders, versionSource } from '../structure/downloads.ts';
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

/**
 * Returns the version number from the text of a `description.xml`. Throws
 * when there is no `<version value="...">` entry, more than one, or an empty one.
 */
export function readVersion(xml: string): string {
	const withoutComments = xml.replace(/<!--[\s\S]*?-->/g, '');
	// The tag can carry a namespace prefix, for example `<d:version value="1.0"/>`.
	const pattern = /<(?:[\w.-]+:)?version\b[^>]*?\svalue\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	const values = [...withoutComments.matchAll(pattern)].map((match) => (match[1] ?? match[2] ?? '').trim());

	if (values.length === 0) {
		throw new Error('it has no <version value="..."> entry.');
	}
	if (values.length > 1) {
		throw new Error(`it has ${values.length} <version value="..."> entries instead of one.`);
	}
	const [version] = values as [string];
	if (version === '') {
		throw new Error('its <version value="..."> entry is empty.');
	}
	return version;
}

function git(repoRoot: string, args: string[]): string {
	try {
		return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			throw new Error(`${prefix} git is not installed. The build needs it to find the date of the spell check files.`);
		}
		const details = String((error as { stderr?: unknown }).stderr ?? '').trim();
		throw new Error(`${prefix} "git ${args.join(' ')}" failed in ${repoRoot}.${details === '' ? '' : ` Git says: ${details}`}`);
	}
}

/**
 * Returns the date of the last commit that changed `folder`, as `YYYY-MM-DD`.
 * The date is taken as the commit records it, in the time zone of the person
 * who committed. So it does not depend on the time zone of the build computer.
 *
 * Throws when the history is incomplete. A shallow clone, for example the
 * default checkout in GitHub Actions, has only the newest commit. There the
 * date would silently be the date of that commit.
 */
export function readCommitDate(repoRoot: string, folder: string): string {
	if (git(repoRoot, ['rev-parse', '--is-shallow-repository']) === 'true') {
		throw new Error(
			`${prefix} the git history is incomplete (a shallow clone). The date of the last change in ${folder}/ cannot be found. ` +
				'Fetch the full history with "git fetch --unshallow". In GitHub Actions, set "fetch-depth: 0" for actions/checkout.',
		);
	}
	const committed = git(repoRoot, ['log', '-1', '--format=%cI', '--', folder]);
	const date = /^(\d{4}-\d{2}-\d{2})T/.exec(committed)?.[1];
	if (date === undefined) {
		throw new Error(`${prefix} no git commit changed ${folder}/. So the date of the spell check files cannot be found.`);
	}
	return date;
}

/** Throws when a download file is missing, is not a file, or lies in a folder that is never published. */
function checkFile(repoRoot: string, id: DownloadId, source: string): void {
	const unpublished = unpublishedFolders.find((folder) => source === folder || source.startsWith(`${folder}/`));
	if (unpublished !== undefined) {
		throw new Error(`${prefix} ${source} is in ${unpublished}/, whose files are never published. Check "${id}" in src/structure/downloads.ts.`);
	}
	let isFile: boolean;
	try {
		isFile = statSync(join(repoRoot, source)).isFile();
	} catch {
		throw new Error(`${prefix} the file ${source} does not exist. It is the download "${id}" in src/structure/downloads.ts.`);
	}
	if (!isFile) {
		throw new Error(`${prefix} ${source} is not a file. It is the download "${id}" in src/structure/downloads.ts.`);
	}
}

/** Returns the version number from the LibreOffice file. */
function readReleaseVersion(repoRoot: string): string {
	const source = downloads[versionSource.download].source;
	const where = `${versionSource.entry} in ${source}`;
	let xml: Buffer | undefined;
	try {
		xml = readZipEntry(readFileSync(join(repoRoot, source)), versionSource.entry);
	} catch (error) {
		throw new Error(`${prefix} cannot read ${where}: ${(error as Error).message}`);
	}
	if (xml === undefined) {
		throw new Error(`${prefix} ${source} contains no ${versionSource.entry}. The version number is read from it.`);
	}
	try {
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
	const ids = Object.keys(downloads) as DownloadId[];
	const files = ids.map((id) => {
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
