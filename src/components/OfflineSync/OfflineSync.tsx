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
	const {setResetPendingEvents} = useChartDataContext();

	const syncEvents = useCallback((isOnline: boolean) => {
		if (!isOnline || pendingEvents.length === 0) {
			return;
		}

		const timezoneOffset = new Date().getTimezoneOffset();

		fetch('/api/add', {
			body: JSON.stringify({id, events: pendingEvents, timezoneOffset}),
			method: 'POST',
		})
			.then(() => {
				queryClient.invalidateQueries({queryKey: ['data']})
					.then(() => {
						setResetPendingEvents(pendingEvents.map(event => event.id));
					});
			});
	}, [id, pendingEvents, queryClient, setResetPendingEvents]);

	useEffect(() => {
		const unsubscribe = onlineManager.subscribe(syncEvents);

		return () => {
			unsubscribe();
		}
	}, [id, syncEvents]);

	return null;
}
