/**
 * Writes a date in numbers only, so that no language needs month names:
 * `formatDate('2026-11-18')` is `18.11.2026`. All languages use this form.
 *
 * Node runs this file directly for the tests. So it must not import anything from Astro.
 */
export function formatDate(isoDate: string): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
	if (match === null) {
		throw new Error(`"${isoDate}" is not a date of the form YYYY-MM-DD.`);
	}
	const [, year, month, day] = match;
	return `${day}.${month}.${year}`;
}
