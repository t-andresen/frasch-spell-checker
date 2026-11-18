/**
 * Tests for the date format. Run them with `npm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate } from './formatDate.ts';

test('each language writes the date in its own numeric form', () => {
	assert.equal(formatDate('2027-01-05', 'frr'), '05.01.2027');
	assert.equal(formatDate('2027-01-05', 'de'), '05.01.2027');
	assert.equal(formatDate('2027-01-05', 'en'), '2027-01-05');
});

test('a value that is not a date stops the build', () => {
	assert.throws(() => formatDate('18.11.2026', 'de'), /not a date/);
	assert.throws(() => formatDate('2026-11-18T10:00:00+01:00', 'de'), /not a date/);
	assert.throws(() => formatDate('', 'de'), /not a date/);
});
