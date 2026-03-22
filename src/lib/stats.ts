import type {Event} from "@/types";

export function computeDailyStats(milkEvents: Event[]) {
	const totalFeedings = milkEvents.length;
	const totalAmount = milkEvents.reduce((sum, feeding) => sum + feeding.amount, 0);
	const averageAmount = totalFeedings > 0 ? totalAmount / totalFeedings : 0;
	const intervals: number[] = [];

	for (let i = 1; i < milkEvents.length; i++) {
		const diff = (
			new Date(milkEvents[i].time).getTime() - new Date(milkEvents[i - 1].time).getTime()
		);

		intervals.push(diff / (1000 * 60));
	}

	const averageInterval = intervals.length > 0
			? intervals.reduce((a, b) => a + b, 0) / intervals.length
			: 0;

	return {
		totalFeedings,
		totalAmount,
		averageAmount,
		averageInterval,
	};
}