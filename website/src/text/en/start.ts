import type { StartPageText } from '../types';

export default {
	title: 'North Frisian Spell Checker',
	intro: 'A spell checker for Mooring North Frisian, available to download for different programs. LibreOffice has the best spell checking support for additional languages. We therefore recommend using it instead of other programs where possible.',
	variety: 'The spelling follows the Ååstermooring dialect and is based on the Frasch Uurdebök (Neumünster 1988). Beyond the Ååstermooring form, a few words also appear in other spellings from the Bökingharde dialect group, because some of these were included in the Frasch Uurdebök.',
	toolNote: {
		heading: 'Not a standard',
		text: 'This tool is not meant to represent or enforce a standard, and it is not complete. It is only meant as a help. Everyone is free to use a different spelling from the one the program suggests, or to use words the program does not know.',
	},
	tiles: {
		libreOffice: {
			title: 'LibreOffice',
			text: 'Download and installation',
		},
		word: {
			title: 'MS Word',
			text: 'Download and installation for Windows',
		},
	},
	macNote: 'The Mac version still needs to be worked out. If you have a Mac and would like to help test it, please [let us know](aboutPage).',
	notSupported: 'The spell checker does not work on iPhone or iPad, and it cannot be used with Word in the browser.',
} satisfies StartPageText;
