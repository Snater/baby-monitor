'use client'

import {useEffect} from 'react';
import useChartDataContext from '@/components/ChartDataContext';
import useIdContext from '@/components/IdContext';
import useIsOnlineContext from '@/components/IsOnlineContext';
import {useQueryClient} from '@tanstack/react-query';
import useStore from '@/store';

export default function OfflineSync() {
	const queryClient = useQueryClient();
	const {id} = useIdContext();
	const {isOnline} = useIsOnlineContext();
	const pendingEvents = useStore(state => state.pendingEvents);
	const {setResetSync} = useChartDataContext();
	const pendingDelete = useStore(state => state.pendingDelete);

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

				setResetSync({
					events: pendingEvents.map(event => event.id),
					delete: pendingDelete,
				});
			} catch (error) {
				if (!(error instanceof Error && error.name === 'AbortError')) {
					console.error('Offline sync failed:', error);
				}
			}
		})();

		return () => controller.abort();
	}, [id, isOnline, pendingDelete, pendingEvents, queryClient, setResetSync]);

	return null;
}