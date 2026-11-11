/**
 * Tests for the checks of the built site. Run them with `npm test`.
 * Each test builds a small site in memory and looks at the reported problems.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkSite, findCssAddresses, findImageListAddresses } from './siteCheck.ts';

const site = 'https://example.org';
const base = '/site';

function page(body: string, head = ''): string {
	return `<!doctype html><html lang="en"><head><title>t</title>${head}</head><body>${body}</body></html>`;
}

/** Checks a site given as file path and content. Returns the messages, each with its file in front. */
function check(files: Record<string, string>, options = { site, base }): string[] {
	return checkSite({ ...options, files: Object.keys(files), read: (file) => files[file] ?? '' }).map(
		(problem) => `${problem.file}: ${problem.message}`,
	);
}

/** Checks a start page with the given body and expects exactly one problem that matches. */
function expectOneProblem(body: string, expected: RegExp, head = ''): void {
	const problems = check({ 'index.html': page(body, head) });
	assert.equal(problems.length, 1, `expected one problem, got: ${JSON.stringify(problems)}`);
	assert.match(problems[0] ?? '', expected);
}

function expectNoProblem(files: Record<string, string>): void {
	assert.deepEqual(check(files), []);
}

test('a site with working links, an image and a download passes', () => {
	expectNoProblem({
		'index.html': page(
			'<a href="/site/de/">Deutsch</a> <a href="/site/">Start</a> <a href="/site/downloads/Frasch.dic">File</a>' +
				'<img src="/site/images/step.png" alt="">',
			'<link rel="stylesheet" href="/site/_astro/main.css"><link rel="icon" href="/site/favicon.svg">',
		),
		'de/index.html': page('<a href="/site/">Start</a>'),
		'downloads/Frasch.dic': '',
		'images/step.png': '',
		'_astro/main.css': 'body { background: url(../images/step.png) }',
		'favicon.svg': '',
	});
});

test('a link to a page that does not exist is reported with its file', () => {
	const problems = check({
		'index.html': page('<a href="/site/de/">ok</a>'),
		'de/index.html': page('<a href="/site/de/word/">broken</a>'),
	});
	assert.equal(problems.length, 1);
	assert.match(problems[0] ?? '', /^de\/index\.html: <a href="\/site\/de\/word\/"> leads to a page that does not exist/);
});

test('a relative link is resolved from the address of its page', () => {
	const files = {
		'index.html': page('<a href="de/">ok</a>'),
		'de/index.html': page('<a href="../">ok</a> <a href="word/">ok</a> <a href="">this page</a>'),
		'de/word/index.html': page('<a href="../../">ok</a>'),
	};
	expectNoProblem(files);
	assert.equal(check({ ...files, 'en/index.html': page('<a href="word/">broken</a>') }).length, 1);
});

test('an internal link without the folder of the site is reported', () => {
	expectOneProblem('<a href="/de/">Deutsch</a>', /leads outside the folder of the site, "\/site\/".*pageLink\(\)/);
});

test('a link to a page without the slash at the end is reported', () => {
	const files = { 'index.html': page('<a href="/site/de">Deutsch</a>'), 'de/index.html': page('') };
	assert.match(check(files)[0] ?? '', /has no slash at the end/);
	expectOneProblem('<a href="/site">Start</a>', /has no slash at the end/);
});

test('a link to a place on a page needs an element with that id', () => {
	expectNoProblem({
		'index.html': page('<a href="#steps">ok</a> <a href="/site/de/#mac">ok</a> <a href="#">top</a> <a href="#top">top</a><h2 id="steps">Steps</h2>'),
		'de/index.html': page('<h2 id="mac">Mac</h2>'),
	});
	expectOneProblem('<a href="#steps">broken</a>', /the place "#steps", but that page has no element with this id/);
});

test('a normal link to another site is allowed', () => {
	expectNoProblem({
		'index.html': page(
			'<a href="https://github.com/t-andresen/frasch-spell-checker">Repo</a> <a href="mailto:someone@example.com">Mail</a>' +
				'<a href="https://example.org/another-project/">Same server, other site</a>',
			'<link rel="canonical" href="https://example.org/site/"><link rel="me" href="https://social.example/@someone">',
		),
	});
});

test('a link written in full is checked when it leads into the site', () => {
	expectOneProblem('<a href="https://example.org/site/nowhere/">broken</a>', /leads to a page that does not exist/);
});

test('a missing image or download is reported', () => {
	expectOneProblem('<img src="/site/images/missing.png" alt="">', /<img src="\/site\/images\/missing\.png"> leads to a file that does not exist/);
	expectOneProblem('<a href="/site/downloads/missing.oxt">File</a>', /leads to a file that does not exist/);
});

test('upper and lower case of a file name must match', () => {
	const problems = check({ 'index.html': page('<a href="/site/downloads/frasch.dic">File</a>'), 'downloads/Frasch.dic': '' });
	assert.match(problems[0] ?? '', /leads to a file that does not exist\. Upper and lower case must match/);
});

test('a file name with a space or a special character is found', () => {
	expectNoProblem({
		'index.html': page('<a href="/site/downloads/W%C3%B6rter%20neu.dic">File</a> <a href="/site/downloads/Wörter neu.dic">File</a>'),
		'downloads/Wörter neu.dic': '',
	});
});

test('every image in a list of sizes is checked', () => {
	const files = { 'index.html': page('<img src="/site/a.png" srcset="/site/a.png 1x, /site/b.png 2x" alt="">'), 'a.png': '' };
	assert.deepEqual(check(files), ['index.html: <img srcset="/site/a.png 1x, /site/b.png 2x"> leads to a file that does not exist. Upper and lower case must match.']);
	assert.deepEqual(findImageListAddresses('a.png, b.png 2x,c.png 100w ,data:image/png;base64,AAA= 3x'), [
		'a.png',
		'b.png',
		'c.png',
		'data:image/png;base64,AAA=',
	]);
});

test('anything loaded from another server is reported', () => {
	const another = /loads a file from another server/;
	expectOneProblem('<img src="https://cdn.example.com/a.png" alt="">', another);
	expectOneProblem('<img src="//cdn.example.com/a.png" alt="">', another);
	expectOneProblem('<iframe src="https://video.example.com/embed/1"></iframe>', another);
	expectOneProblem('<video poster="https://cdn.example.com/a.png"></video>', another);
	expectOneProblem('<svg><use href="https://cdn.example.com/icons.svg#a"></use></svg>', another);
	expectOneProblem('', another, '<link rel="stylesheet" href="https://fonts.example.com/css?family=A">');
	expectOneProblem('', another, '<link rel="preconnect" href="https://fonts.example.com">');
	expectOneProblem('', another, '<link rel="alternate stylesheet" href="https://cdn.example.com/a.css">');
	expectOneProblem('', another, '<style>@font-face { font-family: A; src: url("https://fonts.example.com/a.woff2") }</style>');
	expectOneProblem('', another, '<style>@import "https://cdn.example.com/a.css";</style>');
	expectOneProblem('<p style="background: url(https://cdn.example.com/a.png)">text</p>', another);
});

test('a stylesheet file is checked like a page', () => {
	const files = (css: string) => ({ 'index.html': page('', '<link rel="stylesheet" href="/site/_astro/a.css">'), '_astro/a.css': css });
	assert.match(check(files('@font-face { src: url(https://fonts.example.com/a.woff2) }'))[0] ?? '', /^_astro\/a\.css: CSS: .* loads a file from another server/);
	assert.match(check(files('body { background: url("missing.png") }'))[0] ?? '', /leads to a file that does not exist/);
	expectNoProblem(files('/* url(https://cdn.example.com/old.png) */ body { background: url(data:image/png;base64,AAA=) }'));
	assert.deepEqual(findCssAddresses(`a { b: url( 'x.png' ) } @import "y.css"; c { d: URL(z.png) }`), ['x.png', 'y.css', 'z.png']);
});

test('an image that is part of the page is allowed', () => {
	expectNoProblem({ 'index.html': page('<img src="data:image/png;base64,AAA=" alt="">') });
});

test('JavaScript is reported', () => {
	expectOneProblem('<script>console.log(1)</script>', /contains a <script> tag/);
	expectOneProblem('<script type="application/ld+json">{}</script>', /contains a <script> tag/);
	expectOneProblem('<button onclick="go()">Go</button>', /<button onclick="go\(\)"> runs JavaScript/);
	expectOneProblem('<a href="javascript:go()">Go</a>', /runs JavaScript/);
	// A script from another server breaks two rules.
	assert.equal(check({ 'index.html': page('<script src="https://cdn.example.com/a.js"></script>') }).length, 2);
});

test('a tag inside <noscript> or <template> is checked too', () => {
	expectOneProblem('<noscript><img src="https://stats.example.com/pixel.gif" alt=""></noscript>', /loads a file from another server/);
	expectOneProblem('<template><img src="/site/missing.png" alt=""></template>', /leads to a file that does not exist/);
});

test('the same problem is reported once per file', () => {
	const broken = '<a href="/site/nowhere/">a</a> <a href="/site/nowhere/">b</a>';
	const problems = check({ 'index.html': page(broken), 'de/index.html': page(broken) });
	assert.equal(problems.length, 2);
});

test('a site at the top of its server needs no folder', () => {
	const files = { 'index.html': page('<a href="/de/">Deutsch</a>'), 'de/index.html': page('<a href="/">Start</a>') };
	assert.deepEqual(check(files, { site, base: '/' }), []);
	assert.deepEqual(check(files, { site, base: '' }), []);
});

test('a build without any page is reported', () => {
	assert.equal(check({}).length, 1);
});
