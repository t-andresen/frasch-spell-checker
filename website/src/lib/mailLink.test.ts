/**
 * Tests for the mail link. Run them with `npm test`.
 * `check:launch` skips test files, so placeholders may appear here.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mailLink } from './mailLink.ts';

test('the link holds the address and the subject', () => {
	assert.equal(mailLink('name@example.org', 'Feedback'), 'mailto:name@example.org?subject=Feedback');
});

test('spaces and special characters in the subject are encoded', () => {
	assert.equal(
		mailLink('name@example.org', 'Wort fehlt: å & ö?'),
		'mailto:name@example.org?subject=Wort%20fehlt%3A%20%C3%A5%20%26%20%C3%B6%3F',
	);
});

test('a placeholder passes as address and as subject', () => {
	assert.equal(
		mailLink('[[all:site.feedbackMailAddress]]', '[[de:about.feedback.mailSubject]]'),
		'mailto:[[all:site.feedbackMailAddress]]?subject=%5B%5Bde%3Aabout.feedback.mailSubject%5D%5D',
	);
});

test('something that is no mail address throws an error', () => {
	const wrong = ['', 'name', 'name@example', 'name @example.org', 'a@b@example.org', 'name@example.org?cc=x', 'x [[all:a.b]]'];
	for (const address of wrong) {
		assert.throws(() => mailLink(address, 'Feedback'), /is not a mail address/, `no error for: ${address}`);
	}
});
