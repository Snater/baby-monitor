import fixture from './demo-events.json';

export function buildDemoEventInserts(): Array<[string, number]> {
	const today = new Date();
	const currentMinuteOfDay = today.getHours() * 60 + today.getMinutes();

	return fixture
		.filter(entry => (
			entry.dayOffset < 0 ||
			entry.hour * 60 + entry.minute <= currentMinuteOfDay
		))
		.map(entry => {
			const date = new Date(
				today.getFullYear(),
				today.getMonth(),
				today.getDate() + entry.dayOffset,
				entry.hour,
				entry.minute
			);
			return [date.toISOString(), entry.amount];
		});
}