'use client'

import {onlineManager, useQueryClient} from '@tanstack/react-query';
import {useCallback, useEffect} from 'react';
import useChartDataContext from '@/components/ChartDataContext';
import useIdContext from '@/components/IdContext';
import useStore from '@/store';

export default function OfflineSync() {
	const queryClient = useQueryClient();
	const {id} = useIdContext();
	const pendingEvents = useStore(state => state.pendingEvents);
	const {setResetSync} = useChartDataContext();
	const pendingDelete = useStore(state => state.pendingDelete);

	const syncEvents = useCallback((isOnline: boolean) => {
		if (!isOnline || pendingEvents.length === 0 && pendingDelete.length === 0) {
			return;
		}

		fetch('/api/sync', {
			body: JSON.stringify({
				id,
				delete: pendingDelete,
				events: pendingEvents,
			}),
			method: 'POST',
		})
			.then(() => {
				queryClient.invalidateQueries({queryKey: ['data']})
					.then(() => {
						setResetSync({
							events: pendingEvents.map(event => event.id),
							delete: pendingDelete,
						});
					});
			});
	}, [id, pendingDelete, pendingEvents, queryClient, setResetSync]);

	useEffect(() => {
		const unsubscribe = onlineManager.subscribe(syncEvents);

		return () => {
			unsubscribe();
		}
	}, [id, syncEvents]);

	return null;
}
