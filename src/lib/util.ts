import type {FormState} from '@/types';

/**
 * Returns the date portion of an ISO date string (YYYY-MM-DD).
 */
export function formatDate(date: Date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Returns a timezone offset string to be used for converting the timezone in SQL.
 */
export function getTimezoneOffsetString(offsetMinutes: number): string {
	const hours = Math.floor(Math.abs(offsetMinutes) / 60);
	const minutes = Math.abs(offsetMinutes) % 60;
	const sign = offsetMinutes >= 0 ? '+' : '-';
	return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Return a local date equivalent of a provided UTC date string. That is, the start of the local day
 * in UTC time.
 * @param date YYYY-mm-dd
 */
export function utcDate(date: string): Date {
	const segments = date.split('-');

	return new Date(Date.UTC(
		parseInt(segments[0], 10),
		parseInt(segments[1], 10) - 1,
		parseInt(segments[2], 10)
	));
}

/**
 * Constructs a `FormState` error response.
 */
export function errorResponse(message: string, error?: unknown): FormState {
	return {error: {message, error: error instanceof Error ? error : undefined}};
}
