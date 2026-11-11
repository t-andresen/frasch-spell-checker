import type { AboutPageText } from '../types';

export default {
	title: '[[en:about.title]]',
	intro: '[[en:about.intro]]',
	sections: {
		words: {
			heading: '[[en:about.sections.words.heading]]',
			text: '[[en:about.sections.words.text]]',
		},
		gaps: {
			heading: '[[en:about.sections.gaps.heading]]',
			text: '[[en:about.sections.gaps.text]]',
		},
		feedback: {
			heading: '[[en:about.sections.feedback.heading]]',
			text: '[[en:about.sections.feedback.text]]',
		},
		license: {
			heading: '[[en:about.sections.license.heading]]',
			text: '[[en:about.sections.license.text]]',
		},
		credits: {
			heading: '[[en:about.sections.credits.heading]]',
			text: '[[en:about.sections.credits.text]]',
		},
		developers: {
			heading: '[[en:about.sections.developers.heading]]',
			text: '[[en:about.sections.developers.text]]',
		},
	},
	feedback: {
		mailButton: '[[en:about.feedback.mailButton]]',
		mailSubject: '[[en:about.feedback.mailSubject]]',
		issuesLink: '[[en:about.feedback.issuesLink]]',
	},
} satisfies AboutPageText;
