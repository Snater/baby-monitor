/**
 * Returns the date portion of an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date) {
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
