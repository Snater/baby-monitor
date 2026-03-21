'use client'

import {useEffect} from 'react';
import useIdContext from '@/components/IdContext';
import useIsOnlineContext from '@/components/IsOnlineContext';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';

export default function OfflineSync() {
	const queryClient = useQueryClient();
	const {id} = useIdContext();
	const {isOnline} = useIsOnlineContext();
	const pendingEvents = useStore(state => state.pendingEvents);
	const pendingDelete = useStore(state => state.pendingDelete);
	const purgePendingEvents = useStore(state => state.purgePendingEvents);
	const purgePendingDelete = useStore(state => state.purgePendingDelete);

	useEffect(() => {
		if (!isOnline || pendingEvents.length === 0 && pendingDelete.length === 0) {
			return;
		}

		const controller = new AbortController();

		(async () => {
			try {
				await fetch('/api/sync', {
					body: JSON.stringify({
						id,
						delete: pendingDelete,
						events: pendingEvents,
					}),
					method: 'POST',
					signal: controller.signal,
				});

				await queryClient.invalidateQueries({queryKey: ['data']});

				purgePendingEvents(pendingEvents.map(event => event.id));
				purgePendingDelete(pendingDelete);
			} catch (error) {
				if (!(error instanceof Error && error.name === 'AbortError')) {
					console.error('Offline sync failed:', error);
				}
			}
		})();

		return () => controller.abort();
	}, [id, isOnline, pendingDelete, pendingEvents, purgePendingDelete, purgePendingEvents, queryClient]);

	return null;
}