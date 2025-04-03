import type {Event} from '@/types';
import {create} from 'zustand';
import {formatDate} from '@/lib/util';

interface Store {
	addLoggedDates: (dates: string[]) => void
	addPendingEvent: (event: Event) => void
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
	pendingEvents: Event[]
	removePendingEvents: (eventIds: number[]) => void
	resetPendingEvents: () => void
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
	addPendingEvent: event => set(state => ({pendingEvents: [...state.pendingEvents, event]})),
	currentDate: undefined,
	logDeleteDone: 0,
	logDeleteLoading: 0,
	loggedDates: [formatDate(new Date())],
	pendingEvents: [],
	removePendingEvents: eventIds => set(state => {
		return {
			pendingEvents: state.pendingEvents
				.map(event => ({
					id: event.id,
					amount: event.amount,
					time: event.time,
				}))
				.filter(event => !eventIds.includes(event.id)),
		};
	}),
	resetPendingEvents: () => set(() => ({pendingEvents: []})),
	setCurrentDate: date => set(() => ({currentDate: date})),
	setLogDeleteDone: deletedId => set(() => ({logDeleteDone: deletedId})),
	setLogDeleteLoading: deletingId => set(() => ({logDeleteLoading: deletingId})),
}));

export default useStore;
