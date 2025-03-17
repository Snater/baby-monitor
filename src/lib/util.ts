/**
 * Returns the date portion of an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date) {
	const month = date.getMonth() + 1;
	const monthString = month < 10 ? '0' + month : month.toString();

	const day = date.getDate();
	const dayString = day < 10 ? '0' + day : day.toString();

	return `${date.getFullYear()}-${monthString}-${dayString}`;
}
