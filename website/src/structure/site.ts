/**
 * The name of the site. It is the same in every language.
 * The header, the footer and the browser tab show it.
 */
export const siteName = 'Frasch Ruchtschriwing';

/** Key of the language the name is written in. Screen readers need it to pronounce the name. */
export const siteNameLanguage = 'frr';

/**
 * The address for feedback by mail. The mail button on the About page uses it.
 * This is the only place that holds the address.
 *
 * It is a placeholder until the project address exists (issue 22). The
 * placeholder has `all` in the place of the language, because the address is
 * the same in every language. `npm run check:launch` reports it like any
 * other placeholder.
 *
 * Never put a private address here. The history of a public repo is permanent.
 */
export const feedbackMailAddress = '[[all:site.feedbackMailAddress]]';
