import {create} from 'zustand';

interface Store {
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
	setCurrentDate: (date?: string) => void
	setLogDeleteDone: (deletedId: number) => void
	setLogDeleteLoading: (deletingId: number) => void
}

const useStore = create<Store>(set => ({
	currentDate: undefined,
	logDeleteDone: 0,
	logDeleteLoading: 0,
	setCurrentDate: date => set(() => ({currentDate: date})),
	setLogDeleteDone: deletedId => set(() => ({logDeleteDone: deletedId})),
	setLogDeleteLoading: deletingId => set(() => ({logDeleteLoading: deletingId})),
}));

export default useStore;
