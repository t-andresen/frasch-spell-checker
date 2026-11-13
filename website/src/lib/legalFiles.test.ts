/**
 * Tests for the rules of the legal page files. Run them with `npm test`.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkLegalFiles, checkLegalHeadings, legalPageLanguage } from './legalFiles.ts';

const known = ['frr', 'de', 'en'];
const rules = { bindingLanguage: 'de', requiredLanguages: ['de', 'en'] };

const de = { language: 'de', hasTranslationNote: false };
const en = { language: 'en', hasTranslationNote: true };
const frr = { language: 'frr', hasTranslationNote: true };

test('the required files are enough, an optional file may exist or not', () => {
	assert.doesNotThrow(() => checkLegalFiles([de, en], known, rules));
	assert.doesNotThrow(() => checkLegalFiles([en, frr, de], known, rules));
});

test('a missing required file stops the build', () => {
	assert.throws(() => checkLegalFiles([de], known, rules), /needs the file "src\/content\/legal\/en\.md"/);
	assert.throws(() => checkLegalFiles([frr, en], known, rules), /needs the file "src\/content\/legal\/de\.md"/);
});

test('a file that is not named after a language stops the build', () => {
	const french = { language: 'fr', hasTranslationNote: true };
	assert.throws(() => checkLegalFiles([de, en, french], known, rules), /legal\/fr\.md" is not named after a language/);
});

test('a translation without a translation note stops the build', () => {
	const bare = { language: 'en', hasTranslationNote: false };
	assert.throws(() => checkLegalFiles([de, bare], known, rules), /legal\/en\.md" is a translation/);
});

test('a translation note in the version that counts legally stops the build', () => {
	const wrong = { language: 'de', hasTranslationNote: true };
	assert.throws(() => checkLegalFiles([wrong, en], known, rules), /legal\/de\.md" is the version that counts legally/);
});

test('a heading of the first level in the text stops the build', () => {
	assert.doesNotThrow(() => checkLegalHeadings('de', []));
	assert.doesNotThrow(() => checkLegalHeadings('de', [2, 3, 2]));
	assert.throws(() => checkLegalHeadings('de', [2, 1]), /legal\/de\.md" has a heading with one "#"/);
});

test('a language without its own file links to the version that counts legally', () => {
	assert.equal(legalPageLanguage('frr', ['de', 'en'], 'de'), 'de');
});

test('a language with its own file links to it', () => {
	assert.equal(legalPageLanguage('frr', ['de', 'en', 'frr'], 'de'), 'frr');
	assert.equal(legalPageLanguage('en', ['de', 'en'], 'de'), 'en');
	assert.equal(legalPageLanguage('de', ['de', 'en'], 'de'), 'de');
});
