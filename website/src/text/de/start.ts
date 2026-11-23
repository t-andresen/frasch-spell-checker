import type { StartPageText } from '../types';

export default {
	title: 'Friesische Rechtschreibprüfung',
	intro: 'Rechtschreibprüfung für das Mooringer Frasch zum Download für verschiedene Programme. LibreOffice unterstützt Rechtschreibprüfung für andere Sprachen am besten. Daher wird empfohlen, wenn möglich, es anderen Programmen vorzuziehen.',
	variety: 'Die Rechtschreibung folgt dem Ostermooringer Dialekt und basiert auf dem Frasch Uurdebök (Neumünster 1988). Über die Ostermooringer Form hinaus kommen für vereinzelte Wörter auch andere Schreibweisen aus der Bökingharder Dialektgruppe vor, da sie teilweise ins Frasch Uurdebök mit aufgenommen wurden.',
	toolNote: {
		heading: 'Kein Standard',
		text: 'Dieses Werkzeug soll keinen Standard repräsentieren oder durchsetzen und ist auch nicht vollständig. Es ist lediglich als Hilfe gedacht. Jeder ist frei, eine andere Schreibweise zu benutzen, als sie vom Programm vorgeschlagen wird, oder Wörter zu benutzen, die das Programm nicht kennt.',
	},
	tiles: {
		libreOffice: {
			title: 'LibreOffice',
			text: 'Download und Installation',
		},
		word: {
			title: 'MS Word',
			text: 'Download und Installation für Windows',
		},
	},
	macNote: 'Die Mac-Variante muss noch ausgearbeitet werden. Wenn du einen Mac hast und helfen möchtest, es zu testen, gib gerne [Bescheid](aboutPage).',
	notSupported: 'Die Rechtschreibprüfung funktioniert nicht für iPhone oder iPad und kann auch nicht für Word im Browser benutzt werden.',
} satisfies StartPageText;
