import type { AboutPageText } from '../types';

export default {
	title: '[[frr:about.title]]',
	intro: '[[frr:about.intro]]',
	sections: {
		words: {
			heading: '[[frr:about.sections.words.heading]]',
			text: '[[frr:about.sections.words.text]]',
		},
		gaps: {
			heading: '[[frr:about.sections.gaps.heading]]',
			text: '[[frr:about.sections.gaps.text]]',
		},
		feedback: {
			heading: '[[frr:about.sections.feedback.heading]]',
			text: '[[frr:about.sections.feedback.text]]',
		},
		license: {
			heading: '[[frr:about.sections.license.heading]]',
			text: '[[frr:about.sections.license.text]]',
		},
		credits: {
			heading: '[[frr:about.sections.credits.heading]]',
			text: '[[frr:about.sections.credits.text]]',
		},
		developers: {
			heading: '[[frr:about.sections.developers.heading]]',
			text: '[[frr:about.sections.developers.text]]',
		},
	},
	feedback: {
		mailButton: '[[frr:about.feedback.mailButton]]',
		mailSubject: '[[frr:about.feedback.mailSubject]]',
		issuesLink: '[[frr:about.feedback.issuesLink]]',
	},
} satisfies AboutPageText;
