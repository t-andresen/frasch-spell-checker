/**
 * Tests for reading version and date. Run them with `npm test`.
 *
 * The date tests build small git repos in a temporary folder.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { downloads, spellCheckFolder, unpublishedFolders } from '../structure/downloads.ts';
import { makeZip } from './makeZip.ts';
import { readCommitDate, readRelease, readVersion } from './release.ts';

const tempFolder = mkdtempSync(join(tmpdir(), 'release-test-'));
after(() => rmSync(tempFolder, { recursive: true, force: true }));
let repoCount = 0;

function git(repo: string, args: string[], date = '2026-11-18T23:30:00+01:00'): string {
	return execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.org', '-c', 'commit.gpgsign=false', ...args], {
		cwd: repo,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe'],
		env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
	}).trim();
}

function writeFile(repo: string, path: string, content: string | Buffer): void {
	mkdirSync(dirname(join(repo, path)), { recursive: true });
	writeFileSync(join(repo, path), content);
}

/** A new empty git repo in the temporary folder. */
function newRepo(): string {
	const repo = join(tempFolder, `repo-${++repoCount}`);
	mkdirSync(repo);
	git(repo, ['init', '--quiet']);
	return repo;
}

function oxt(descriptionXml: string): Buffer {
	return makeZip([
		{ name: 'mooring.dic', content: 'words' },
		{ name: 'description.xml', content: descriptionXml },
	]);
}

/** A repo with all download files, committed once. */
function completeRepo(descriptionXml = '<description><version value="1.2.0"/></description>'): string {
	const repo = newRepo();
	writeFile(repo, downloads.libreOffice.source, oxt(descriptionXml));
	writeFile(repo, downloads.word.source, 'words');
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', 'Add files']);
	return repo;
}

// Version

test('reads the version from description.xml', () => {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<description xmlns="http://openoffice.org/extensions/description/2006">
  <identifier value="org.example.frasch"/>
  <version value="1.2.0"/>
  <dependencies>
    <OpenOffice.org-minimal-version value="4.0" d:name="OpenOffice.org 4.0"/>
  </dependencies>
</description>`;
	assert.equal(readVersion(xml), '1.2.0');
});

test('the xml declaration and comments do not count as the version', () => {
	assert.equal(readVersion('<?xml version="1.0"?><!-- <version value="9.9"/> --><description><version value="2.0"/></description>'), '2.0');
});

test('single quotes, spaces and a namespace prefix are understood', () => {
	assert.equal(readVersion("<d:version  value = ' 3.1 ' />"), '3.1');
});

test('a missing, empty or doubled version is reported', () => {
	assert.throws(() => readVersion('<description><identifier value="x"/></description>'), /no <version value/);
	assert.throws(() => readVersion('<description><version value=""/></description>'), /empty/);
	assert.throws(() => readVersion('<version value="1.0"/><version value="2.0"/>'), /2 <version value/);
});

// Date

test('the date is the date of the last commit that changed the folder', () => {
	const repo = newRepo();
	writeFile(repo, 'spell_check/a.dic', 'one');
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', 'Spell check'], '2026-10-01T12:00:00+02:00');
	writeFile(repo, 'website/page.txt', 'later');
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', 'Website only'], '2026-11-05T12:00:00+01:00');

	assert.equal(readCommitDate(repo, 'spell_check'), '2026-10-01');
});

test('the date is the one in the time zone of the commit, not of the build computer', () => {
	const repo = completeRepo();
	// The commit is at 23:30 on 18 November in UTC+1. In UTC it is still the 18th, in UTC+2 already the 19th.
	assert.equal(readCommitDate(repo, spellCheckFolder), '2026-11-18');
});

test('a folder without any commit is reported', () => {
	const repo = newRepo();
	writeFile(repo, 'other/file.txt', 'x');
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', 'Other']);
	assert.throws(() => readCommitDate(repo, 'spell_check'), /no git commit changed spell_check\//);
});

test('a shallow clone is reported with a hint for GitHub Actions', () => {
	const repo = completeRepo();
	writeFile(repo, 'website/page.txt', 'later');
	git(repo, ['add', '.']);
	git(repo, ['commit', '--quiet', '-m', 'Website only']);

	const clone = join(tempFolder, `clone-${++repoCount}`);
	execFileSync('git', ['clone', '--quiet', '--depth', '1', pathToFileURL(repo).href, clone], { stdio: 'ignore' });
	assert.throws(() => readCommitDate(clone, spellCheckFolder), /shallow clone.*fetch-depth: 0/);
});

test('a folder that is no git repo is reported', () => {
	const folder = join(tempFolder, `plain-${++repoCount}`);
	mkdirSync(folder);
	// The temporary folder lies outside every repo, so git finds none.
	assert.throws(() => readCommitDate(folder, spellCheckFolder), /git rev-parse --is-shallow-repository" failed/);
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
		assert.throws(
			() => readRelease(repo),
			(error: Error) => error.message.includes(`the file ${download.source} does not exist`),
		);
	}
});

test('a LibreOffice file without description.xml is reported', () => {
	const repo = completeRepo();
	writeFile(repo, downloads.libreOffice.source, makeZip([{ name: 'mooring.dic', content: 'words' }]));
	assert.throws(() => readRelease(repo), /contains no description\.xml/);
});

test('a LibreOffice file that is no zip archive is reported', () => {
	const repo = completeRepo();
	writeFile(repo, downloads.libreOffice.source, 'not a zip archive');
	assert.throws(() => readRelease(repo), /cannot read description\.xml in .*: The file is not a zip archive/);
});

test('a description.xml without a version is reported', () => {
	const repo = completeRepo('<description></description>');
	assert.throws(() => readRelease(repo), /cannot read the version number from description\.xml/);
});

test('no download comes from a folder that is never published', () => {
	for (const { source } of Object.values(downloads)) {
		assert.ok(source.startsWith(`${spellCheckFolder}/`), `${source} is outside ${spellCheckFolder}/`);
		for (const folder of unpublishedFolders) {
			assert.ok(!source.startsWith(`${folder}/`), `${source} is in ${folder}/`);
		}
	}
});
