import { defineConfig } from 'astro/config';
import { defaultLanguage, languages } from './src/i18n/languages';

// https://astro.build/config
export default defineConfig({
	// Where the site is published. `site` and `base` are set only here.
	// For a custom domain later: change `site` and remove `base`.
	site: 'https://t-andresen.github.io',
	base: '/frasch-spell-checker',

	output: 'static',

	// Every page address ends with a slash, like the folders GitHub Pages serves.
	trailingSlash: 'always',

	// The languages come from `src/i18n/languages.ts`. The default language has no
	// address prefix. The others live in a folder under `src/pages/` named like their key.
	i18n: {
		locales: languages.map((language) => language.key),
		defaultLocale: defaultLanguage.key,
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
