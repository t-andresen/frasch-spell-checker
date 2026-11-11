/**
 * Launch check: fails if any placeholder is left in the source of the site.
 *
 * Run it with `npm run check:launch`. It is not part of `npm run build`,
 * because placeholders are expected until all text is written.
 *
 * It reads every text file under `src/` and looks for placeholders in the form
 * that `src/lib/placeholders.ts` defines. That covers the text modules of all
 * languages and also Markdown files. Test files are skipped.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { findPlaceholders } from '../src/lib/placeholders.ts';

const websiteFolder = join(import.meta.dirname, '..');
const sourceFolder = join(websiteFolder, 'src');
const checkedExtensions = ['.ts', '.astro', '.md', '.mdx', '.json', '.html', '.css'];

function isChecked(fileName: string): boolean {
	return !fileName.endsWith('.test.ts') && checkedExtensions.some((extension) => fileName.endsWith(extension));
}

/** All checked files below a folder, sorted by path. */
function listFiles(folder: string): string[] {
	return readdirSync(folder, { withFileTypes: true, recursive: true })
		.filter((entry) => entry.isFile() && isChecked(entry.name))
		.map((entry) => join(entry.parentPath, entry.name))
		.sort();
}

let total = 0;
const countPerLanguage = new Map<string, number>();

for (const file of listFiles(sourceFolder)) {
	const lines = readFileSync(file, 'utf8').split('\n');
	const found = lines.flatMap((line, index) =>
		findPlaceholders(line).map((placeholder) => ({ lineNumber: index + 1, placeholder })),
	);
	if (found.length === 0) {
		continue;
	}

	console.log(`\n${relative(websiteFolder, file).replaceAll('\\', '/')} (${found.length})`);
	for (const { lineNumber, placeholder } of found) {
		console.log(`  line ${lineNumber}: ${placeholder}`);

		// The language key is the part between the opening brackets and the colon.
		const language = placeholder.slice(2, placeholder.indexOf(':'));
		countPerLanguage.set(language, (countPerLanguage.get(language) ?? 0) + 1);
		total += 1;
	}
}

if (total === 0) {
	console.log('Launch check passed: no placeholders left.');
} else {
	const perLanguage = [...countPerLanguage].map(([language, count]) => `${language}: ${count}`).join(', ');
	console.error(`\nLaunch check failed: ${total} placeholders left (${perLanguage}).`);
	console.error('Replace each one with real text before the launch.');
	process.exitCode = 1;
}
