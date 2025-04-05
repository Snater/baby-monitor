import type {Event} from '@/types';
import type {StateCreator} from 'zustand';

export interface OfflineSlice {
	addPendingDelete: (id: number) => void
	addPendingEvent: (event: Event) => void
	pendingDelete: number[]
	pendingEvents: Event[]
	purgePendingDelete: (ids: number[]) => void
	purgePendingEvents: (eventIds: number[]) => void
}

export const createOfflineSlice: StateCreator<OfflineSlice> = set => ({
	addPendingDelete: id => set(state => ({pendingDelete: [...state.pendingDelete, id]})),
	addPendingEvent: event => set(state => ({pendingEvents: [...state.pendingEvents, event]})),
	pendingDelete: [],
	pendingEvents: [],
	purgePendingDelete: ids => set(state => ({
		pendingDelete: state.pendingDelete.filter(id => !ids.includes(id)),
	})),
	purgePendingEvents: eventIds => set(state => {
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
});
