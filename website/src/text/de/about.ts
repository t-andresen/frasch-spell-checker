import type { AboutPageText } from '../types';

export default {
	title: '[[de:about.title]]',
	intro: '[[de:about.intro]]',
	sections: {
		words: {
			heading: '[[de:about.sections.words.heading]]',
			text: '[[de:about.sections.words.text]]',
		},
		gaps: {
			heading: '[[de:about.sections.gaps.heading]]',
			text: '[[de:about.sections.gaps.text]]',
		},
		feedback: {
			heading: '[[de:about.sections.feedback.heading]]',
			text: '[[de:about.sections.feedback.text]]',
		},
		license: {
			heading: '[[de:about.sections.license.heading]]',
			text: '[[de:about.sections.license.text]]',
		},
		credits: {
			heading: '[[de:about.sections.credits.heading]]',
			text: '[[de:about.sections.credits.text]]',
		},
		developers: {
			heading: '[[de:about.sections.developers.heading]]',
			text: '[[de:about.sections.developers.text]]',
		},
	},
	feedback: {
		mailButton: '[[de:about.feedback.mailButton]]',
		mailSubject: '[[de:about.feedback.mailSubject]]',
		issuesLink: '[[de:about.feedback.issuesLink]]',
	},
} satisfies AboutPageText;
