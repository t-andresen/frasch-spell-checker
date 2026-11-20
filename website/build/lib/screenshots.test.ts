/**
 * Tests for finding missing screenshots. Run them with `npm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { findMissingScreenshots } from './screenshots.ts';

const pages = {
	first: {
		steps: [{ id: 'one' }, { id: 'two', screenshot: 'first-two.png' }, { id: 'three', screenshot: 'first-three.png' }],
		notes: [],
	},
	second: {
		steps: [{ id: 'one', screenshot: 'second-one.png' }],
		notes: [],
	},
} as const;

test('lists every screenshot that is not there, in the order of pages and steps', () => {
	assert.deepEqual(findMissingScreenshots(pages, ['first-three.png']), [
		{ page: 'first', step: 'two', file: 'first-two.png' },
		{ page: 'second', step: 'one', file: 'second-one.png' },
	]);
});

test('lists nothing when all screenshots are there', () => {
	assert.deepEqual(findMissingScreenshots(pages, ['first-two.png', 'first-three.png', 'second-one.png', 'other.png']), []);
});

test('compares the file names exactly, also in upper and lower case', () => {
	assert.deepEqual(findMissingScreenshots({ second: pages.second }, ['Second-One.png']), [
		{ page: 'second', step: 'one', file: 'second-one.png' },
	]);
});
