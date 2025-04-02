import {create} from 'zustand';
import {formatDate} from '@/lib/util';

interface Store {
	addLoggedDates: (dates: string[]) => void
	/**
	 * The currently viewed date in YYYY-MM-DD format.
	 */
	currentDate?: string
	/**
	 * The id of the event that has been deleted last.
	 */
	logDeleteDone: number
	/**
	 * The id of the event that is being deleted.
	 */
	logDeleteLoading: number
	loggedDates: string[]
	setCurrentDate: (date?: string) => void
	setLogDeleteDone: (deletedId: number) => void
	setLogDeleteLoading: (deletingId: number) => void
}

const useStore = create<Store>(set => ({
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
	currentDate: undefined,
	logDeleteDone: 0,
	logDeleteLoading: 0,
	loggedDates: [formatDate(new Date())],
	setCurrentDate: date => set(() => ({currentDate: date})),
	setLogDeleteDone: deletedId => set(() => ({logDeleteDone: deletedId})),
	setLogDeleteLoading: deletingId => set(() => ({logDeleteLoading: deletingId})),
}));

export default useStore;
