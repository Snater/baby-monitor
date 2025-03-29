import {create} from 'zustand';

interface Store {
	/**
	 * The currently viewed date in YYYY-MM-DD format.
	 */
	currentDate?: string
	/**
	 * The id of the event that is being deleted.
	 */
	logDeleteLoading: number | false
	setCurrentDate: (date?: string) => void
	setLogDeleteLoading: (deletingId: number | false) => void
}

const useStore = create<Store>(set => ({
	currentDate: undefined,
	logDeleteLoading: false,
	setCurrentDate: date => set(() => ({currentDate: date})),
	setLogDeleteLoading: deletingId => set(() => ({logDeleteLoading: deletingId})),
}));

export default useStore;
