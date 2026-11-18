/**
 * Tests for the zip reader. Run them with `npm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { makeZip } from './makeZip.ts';
import { readZipEntry } from './zip.ts';

test('reads a compressed file', () => {
	const archive = makeZip([
		{ name: 'mooring.dic', content: 'words' },
		{ name: 'description.xml', content: '<version value="1.0"/>' },
	]);
	assert.equal(readZipEntry(archive, 'description.xml')?.toString('utf8'), '<version value="1.0"/>');
});

test('reads a file that is stored without compression', () => {
	const archive = makeZip([{ name: 'description.xml', content: 'stored', method: 0 }]);
	assert.equal(readZipEntry(archive, 'description.xml')?.toString('utf8'), 'stored');
});

test('a missing file gives undefined', () => {
	const archive = makeZip([{ name: 'mooring.dic', content: 'words' }]);
	assert.equal(readZipEntry(archive, 'description.xml'), undefined);
});

test('a file in a subfolder does not count as a file at the top', () => {
	const archive = makeZip([{ name: 'META-INF/description.xml', content: 'nested' }]);
	assert.equal(readZipEntry(archive, 'description.xml'), undefined);
});

test('a file that is no zip archive is reported', () => {
	assert.throws(() => readZipEntry(Buffer.from('this is plain text, not a zip archive'), 'description.xml'), /not a zip archive/);
	assert.throws(() => readZipEntry(Buffer.alloc(0), 'description.xml'), /not a zip archive/);
});

test('an encrypted file is reported', () => {
	const archive = makeZip([{ name: 'description.xml', content: 'secret', flags: 1 }]);
	assert.throws(() => readZipEntry(archive, 'description.xml'), /encrypted/);
});

test('a cut-off archive is reported', () => {
	const archive = makeZip([{ name: 'description.xml', content: 'x'.repeat(200), method: 0 }]);
	// Remove the start, so the list of files points to the wrong places.
	assert.throws(() => readZipEntry(archive.subarray(40), 'description.xml'), /damaged/);
});
