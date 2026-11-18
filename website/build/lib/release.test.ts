/**
 * Tests for reading version and date. Run them with `npm test`.
 *
 * The tests build small git repos in a temporary folder. The LibreOffice file
 * in them is `test-files/test.oxt`, with the version `1.2.0`.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { downloads, spellCheckFolder, unpublishedFolders } from '../../src/structure/downloads.ts';
import { readCommitDate, readRelease, readVersion } from './release.ts';

const testOxt = readFileSync(join(import.meta.dirname, '../test-files/test.oxt'));
const tempFolder = mkdtempSync(join(tmpdir(), 'release-test-'));
after(() => rmSync(tempFolder, { recursive: true, force: true }));
let repoCount = 0;

function git(repo: string, args: string[], date = '2026-11-18T23:30:00+01:00'): void {
	execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.org', '-c', 'commit.gpgsign=false', ...args], {
		cwd: repo,
		stdio: 'ignore',
		env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
	});
}

function writeFile(repo: string, path: string, content: string | Buffer): void {
	mkdirSync(dirname(join(repo, path)), { recursive: true });
	writeFileSync(join(repo, path), content);
}

function commit(repo: string, path: string, content: string | Buffer, date?: string): void {
	writeFile(repo, path, content);
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', `Change ${path}`], date);
}

/** A new git repo with all download files, committed once. */
function completeRepo(): string {
	const repo = join(tempFolder, `repo-${++repoCount}`);
	mkdirSync(repo);
	git(repo, ['init', '--quiet']);
	writeFile(repo, downloads.libreOffice.source, testOxt);
	commit(repo, downloads.word.source, 'words');
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
	const repo = completeRepo();
	// 23:30 on 18 November in UTC+1. In UTC+2 it would already be the 19th.
	commit(repo, 'website/page.txt', 'later', '2026-12-05T12:00:00+01:00');
	assert.equal(readCommitDate(repo, spellCheckFolder), '2026-11-18');
});

test('a folder without any commit is reported', () => {
	assert.throws(() => readCommitDate(completeRepo(), 'other'), /no git commit changed other\//);
});

test('a shallow clone is reported with a hint for GitHub Actions', () => {
	const repo = completeRepo();
	commit(repo, 'website/page.txt', 'later');
	const clone = join(tempFolder, `clone-${++repoCount}`);
	execFileSync('git', ['clone', '--quiet', '--depth', '1', pathToFileURL(repo).href, clone], { stdio: 'ignore' });
	assert.throws(() => readCommitDate(clone, spellCheckFolder), /shallow clone.*fetch-depth: 0/);
});

// Everything together

test('reads version, date and the files to copy', () => {
	const repo = completeRepo();
	assert.deepEqual(readRelease(repo), {
		version: '1.2.0',
		date: '2026-11-18',
		files: [
			{ id: 'libreOffice', source: join(repo, downloads.libreOffice.source), target: `downloads/${downloads.libreOffice.fileName}` },
			{ id: 'word', source: join(repo, downloads.word.source), target: `downloads/${downloads.word.fileName}` },
		],
	});
});

test('a missing download file is reported by its path', () => {
	for (const download of Object.values(downloads)) {
		const repo = completeRepo();
		rmSync(join(repo, download.source));
		assert.throws(() => readRelease(repo), (error: Error) => error.message.includes(`the file ${download.source} does not exist`));
	}
});

test('a LibreOffice file without description.xml is reported', () => {
	const repo = completeRepo();
	// Same length, so the archive stays valid: the reader now finds no description.xml.
	const renamed = Buffer.from(testOxt.toString('latin1').replaceAll('description.xml', 'description.txt'), 'latin1');
	writeFile(repo, downloads.libreOffice.source, renamed);
	assert.throws(() => readRelease(repo), /from description\.xml in .*: the file is missing/);
});

test('a LibreOffice file that is no zip archive is reported', () => {
	const repo = completeRepo();
	writeFile(repo, downloads.libreOffice.source, 'not a zip archive');
	assert.throws(() => readRelease(repo), /from description\.xml in .*: The file is not a zip archive/);
});

test('no download comes from a folder that is never published', () => {
	for (const { source } of Object.values(downloads)) {
		assert.ok(source.startsWith(`${spellCheckFolder}/`), `${source} is outside ${spellCheckFolder}/`);
		for (const folder of unpublishedFolders) {
			assert.ok(!source.startsWith(`${folder}/`), `${source} is in ${folder}/`);
		}
	}
});
