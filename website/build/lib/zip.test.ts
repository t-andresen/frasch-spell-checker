/**
 * Tests for the zip reader. Run them with `npm test`.
 *
 * `test-files/test.oxt` holds `mooring.dic`, stored without compression, and
 * `description.xml`, compressed with "deflate", with the version `1.2.0`.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import { readZipEntry } from './zip.ts';

const archive = readFileSync(join(import.meta.dirname, '../test-files/test.oxt'));

test('reads a compressed file', () => {
	assert.match(readZipEntry(archive, 'description.xml')?.toString('utf8') ?? '', /<version value="1\.2\.0"\/>/);
});

test('reads a file that is stored without compression', () => {
	assert.equal(readZipEntry(archive, 'mooring.dic')?.toString('utf8'), 'words\n');
});

test('a missing file gives undefined', () => {
	assert.equal(readZipEntry(archive, 'manifest.xml'), undefined);
});

test('a file that is no zip archive is reported', () => {
	assert.throws(() => readZipEntry(Buffer.from('plain text'), 'description.xml'), /not a zip archive/);
});
