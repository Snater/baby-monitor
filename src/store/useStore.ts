import {createOfflineSlice, OfflineSlice} from '@/store/OfflineSlice';
import {create} from 'zustand';
import {formatDate} from '@/lib/util';

interface Store {
	addLoggedDates: (dates: string[]) => void
	/**
	 * The currently viewed date in YYYY-MM-DD format.
	 */
	currentDate?: string
	loggedDates: string[]
	setCurrentDate: (date?: string) => void
	setStopUpdatingTime: (stopUpdatingTime: boolean) => void
	stopUpdatingTime: boolean
}

const useStore = create<Store & OfflineSlice>((set, ...rest) => ({
	...createOfflineSlice(set, ...rest),
	addLoggedDates: dates => set(state => {
		const updatedDates = [...state.loggedDates];

		dates.forEach(date => {
			if (!updatedDates.includes(date)) {
				updatedDates.push(date);
			}
		});

		updatedDates.sort((a, b) => new Date(a) > new Date(b) ? 1 : -1);

		return {loggedDates: updatedDates};
	}),
	currentDate: formatDate(new Date()),
	loggedDates: [formatDate(new Date())],
	setCurrentDate: date => set(() => ({currentDate: date})),
	setStopUpdatingTime: stopUpdatingTime => set(() => ({stopUpdatingTime})),
	stopUpdatingTime: false,
}));

export default useStore;
