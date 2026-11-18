/**
 * Tests for the date format. Run them with `npm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDate } from './formatDate.ts';

test('the date is written as day, month and year in numbers', () => {
	assert.equal(formatDate('2026-11-18'), '18.11.2026');
	assert.equal(formatDate('2027-01-05'), '05.01.2027');
});

test('a value that is not a date stops the build', () => {
	assert.throws(() => formatDate('18.11.2026'), /not a date/);
	assert.throws(() => formatDate('2026-11-18T10:00:00+01:00'), /not a date/);
	assert.throws(() => formatDate(''), /not a date/);
});
