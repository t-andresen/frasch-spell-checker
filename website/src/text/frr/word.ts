import type { WordPageText } from '../types';

export default {
	title: '[[frr:word.title]]',
	intro: '[[frr:word.intro]]',
	steps: {
		download: {
			text: '[[frr:word.steps.download.text]]',
		},
		moveFile: {
			text: '[[frr:word.steps.moveFile.text]]',
			imageDescription: '[[frr:word.steps.moveFile.imageDescription]]',
		},
		openOptions: {
			text: '[[frr:word.steps.openOptions.text]]',
			imageDescription: '[[frr:word.steps.openOptions.imageDescription]]',
		},
		openCustomDictionaries: {
			text: '[[frr:word.steps.openCustomDictionaries.text]]',
			imageDescription: '[[frr:word.steps.openCustomDictionaries.imageDescription]]',
		},
		addFile: {
			text: '[[frr:word.steps.addFile.text]]',
			imageDescription: '[[frr:word.steps.addFile.imageDescription]]',
		},
	},
	screenshotsNote: '[[frr:word.screenshotsNote]]',
	notes: {
		proofingLanguage: {
			heading: '[[frr:word.notes.proofingLanguage.heading]]',
			text: '[[frr:word.notes.proofingLanguage.text]]',
		},
		check: {
			heading: '[[frr:word.notes.check.heading]]',
			text: '[[frr:word.notes.check.text]]',
		},
		update: {
			heading: '[[frr:word.notes.update.heading]]',
			text: '[[frr:word.notes.update.text]]',
		},
		browser: {
			heading: '[[frr:word.notes.browser.heading]]',
			text: '[[frr:word.notes.browser.text]]',
		},
	},
} satisfies WordPageText;
