import type {Event} from '@/types';
import type {StateCreator} from 'zustand';

export interface OfflineSlice {
	addPendingEvent: (event: Event) => void
	pendingEvents: Event[]
	removePendingEvents: (eventIds: number[]) => void
	resetPendingEvents: () => void
}

export const createOfflineSlice: StateCreator<OfflineSlice> = set => ({
	addPendingEvent: event => set(state => ({pendingEvents: [...state.pendingEvents, event]})),
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
});
