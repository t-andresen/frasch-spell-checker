/**
 * Tests for the text markup. Run them with `npm test`.
 * `check:launch` skips test files, so placeholders may appear here.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseRichText, richTextToHtml } from './richText.ts';

const linkNames = ['repo', 'aboutPage'] as const;
const addresses = { repo: 'https://example.org/?a=1&b=2', aboutPage: '/about/' };

function html(source: string): string {
	return richTextToHtml(parseRichText(source, linkNames), (name) => addresses[name]);
}

test('plain text stays as it is', () => {
	assert.equal(html('Just a sentence (with brackets).'), 'Just a sentence (with brackets).');
});

test('emphasis and strong emphasis', () => {
	assert.equal(html('a *b* c'), 'a <em>b</em> c');
	assert.equal(html('a **b** c'), 'a <strong>b</strong> c');
});

test('emphasis and strong emphasis can be nested', () => {
	assert.equal(html('**a *b***'), '<strong>a <em>b</em></strong>');
	assert.equal(html('*a **b***'), '<em>a <strong>b</strong></em>');
	assert.equal(html('***a***'), '<strong><em>a</em></strong>');
});

test('a link uses the address of its name', () => {
	assert.equal(html('See [the page](aboutPage).'), 'See <a href="/about/">the page</a>.');
});

test('a link text can contain emphasis, and emphasis can contain a link', () => {
	assert.equal(html('[the *page*](aboutPage)'), '<a href="/about/">the <em>page</em></a>');
	assert.equal(html('*[the page](aboutPage)*'), '<em><a href="/about/">the page</a></em>');
});

test('HTML in a text is shown as characters, not run as HTML', () => {
	assert.equal(html('<script>alert("x")</script> & more'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; more');
});

test('the address of a link is escaped', () => {
	assert.equal(html('[x](repo)'), '<a href="https://example.org/?a=1&amp;b=2">x</a>');
});

test('a backslash makes the next marker literal', () => {
	assert.equal(html('\\*.dic and \\[x\\] and \\\\'), '*.dic and [x] and \\');
});

test('a placeholder passes through unchanged', () => {
	assert.equal(html('[[frr:word.steps.moveFile.text]]'), '[[frr:word.steps.moveFile.text]]');
	assert.equal(html('*[[de:start.intro]]*'), '<em>[[de:start.intro]]</em>');
});

test('wrong markup throws an error', () => {
	const wrong = [
		'a *b',
		'a **b',
		'a **b*',
		'a ** b',
		'a [b',
		'a b]',
		'[b] (repo)',
		'[b](repo',
		'[](repo)',
		'[a [b](repo)](repo)',
		'[a *b](repo)*',
		'**a [b**](repo)',
		'a \\b',
		'a \\',
	];
	for (const source of wrong) {
		assert.throws(() => html(source), /Markup error/, `no error for: ${source}`);
	}
});

test('an unknown link name throws an error that lists the known names', () => {
	assert.throws(() => html('[x](nowhere)'), /Unknown link name "nowhere". Known names: repo, aboutPage\./);
});

test('an address instead of a link name throws an error', () => {
	assert.throws(() => html('[x](https://example.org)'), /Markup error/);
});
