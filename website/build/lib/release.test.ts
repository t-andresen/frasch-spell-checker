/**
 * Tests for reading version and date. Run them with `npm test`.
 *
 * Only the date tests use git. Each of them builds a small git repo of its own
 * in a temporary folder, which is deleted at the end. They never touch the git
 * repo of this project. The other tests use plain folders.
 *
 * The LibreOffice file in the tests is `test-files/test.oxt`, with the version `1.2.0`.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { downloads, spellCheckFolder, unpublishedFolders } from '../../src/structure/downloads.ts';
import { gitEnvironment, readCommitDate, readDownloads, readVersion } from './release.ts';

const testOxt = readFileSync(join(import.meta.dirname, '../test-files/test.oxt'));
const tempFolder = mkdtempSync(join(tmpdir(), 'release-test-'));
after(() => rmSync(tempFolder, { recursive: true, force: true }));
let folderCount = 0;

/** A new empty folder inside the temporary folder. */
function newFolder(): string {
	const folder = join(tempFolder, `folder-${++folderCount}`);
	mkdirSync(folder);
	return folder;
}

function writeFile(folder: string, path: string, content: string | Buffer): void {
	mkdirSync(dirname(join(folder, path)), { recursive: true });
	writeFileSync(join(folder, path), content);
}

/** A plain folder, no git, with all download files. */
function downloadFolder(): string {
	const folder = newFolder();
	writeFile(folder, downloads.libreOffice.source, testOxt);
	writeFile(folder, downloads.word.source, 'words');
	return folder;
}

// Without variables like GIT_DIR, which could point git at the repo of this project.
const gitEnv = gitEnvironment();

function git(repo: string, args: string[], date = '2026-11-18T23:30:00+01:00'): void {
	execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.org', '-c', 'commit.gpgsign=false', ...args], {
		cwd: repo,
		stdio: 'ignore',
		env: { ...gitEnv, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
	});
}

function commit(repo: string, path: string, date?: string): void {
	writeFile(repo, path, path);
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', `Change ${path}`], date);
}

/** A new git repo with one commit in `spell_check/` and a later one outside it. */
function gitRepo(): string {
	const repo = newFolder();
	git(repo, ['init', '--quiet']);
	commit(repo, `${spellCheckFolder}/words.txt`);
	commit(repo, 'website/page.txt', '2026-12-05T12:00:00+01:00');
	return repo;
}

// Version

test('reads the version from description.xml', () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<description xmlns="http://openoffice.org/extensions/description/2006">
  <version value="1.2.0"/>
  <dependencies><OpenOffice.org-minimal-version value="4.0"/></dependencies>
</description>`;
	assert.equal(readVersion(xml), '1.2.0');
});

test('a namespace prefix on the version tag is understood', () => {
	assert.equal(readVersion('<ns0:description><ns0:version value="2.0"/></ns0:description>'), '2.0');
});

test('a missing, empty or doubled version is reported', () => {
	assert.throws(() => readVersion('<description></description>'), /has 0/);
	assert.throws(() => readVersion('<version value=""/>'), /has an empty one/);
	assert.throws(() => readVersion('<version value="1.0"/><version value="2.0"/>'), /has 2/);
});

// Date

test('the date is the date of the last commit that changed the folder, in its own time zone', () => {
	// The commit in spell_check/ is at 23:30 on 18 November in UTC+1. In UTC+2 it
	// would already be the 19th. The later commit outside spell_check/ does not count.
	assert.equal(readCommitDate(gitRepo(), spellCheckFolder), '2026-11-18');
});

test('a folder without any commit is reported', () => {
	assert.throws(() => readCommitDate(gitRepo(), 'other'), /no git commit changed other\//);
});

test('a shallow clone is reported with a hint for GitHub Actions', () => {
	const clone = join(tempFolder, `clone-${++folderCount}`);
	execFileSync('git', ['clone', '--quiet', '--depth', '1', pathToFileURL(gitRepo()).href, clone], { stdio: 'ignore', env: gitEnv });
	assert.throws(() => readCommitDate(clone, spellCheckFolder), /shallow clone.*fetch-depth: 0/);
});

// Download files and version

test('reads the version and the files to copy', () => {
	const folder = downloadFolder();
	assert.deepEqual(readDownloads(folder), {
		version: '1.2.0',
		files: [
			{ id: 'libreOffice', source: join(folder, downloads.libreOffice.source), target: `downloads/${downloads.libreOffice.fileName}` },
			{ id: 'word', source: join(folder, downloads.word.source), target: `downloads/${downloads.word.fileName}` },
		],
	});
});

test('a missing download file is reported by its path', () => {
	for (const download of Object.values(downloads)) {
		const folder = downloadFolder();
		rmSync(join(folder, download.source));
		assert.throws(() => readDownloads(folder), (error: Error) => error.message.includes(`the file ${download.source} does not exist`));
	}
});

test('a LibreOffice file without description.xml is reported', () => {
	const folder = downloadFolder();
	// Same length, so the archive stays valid: the reader now finds no description.xml.
	const renamed = Buffer.from(testOxt.toString('latin1').replaceAll('description.xml', 'description.txt'), 'latin1');
	writeFile(folder, downloads.libreOffice.source, renamed);
	assert.throws(() => readDownloads(folder), /from description\.xml in .*: the file is missing/);
});

test('a LibreOffice file that is no zip archive is reported', () => {
	const folder = downloadFolder();
	writeFile(folder, downloads.libreOffice.source, 'not a zip archive');
	assert.throws(() => readDownloads(folder), /from description\.xml in .*: The file is not a zip archive/);
});

test('no download comes from a folder that is never published', () => {
	for (const { source } of Object.values(downloads)) {
		assert.ok(source.startsWith(`${spellCheckFolder}/`), `${source} is outside ${spellCheckFolder}/`);
		for (const folder of unpublishedFolders) {
			assert.ok(!source.startsWith(`${folder}/`), `${source} is in ${folder}/`);
		}
	}
});
