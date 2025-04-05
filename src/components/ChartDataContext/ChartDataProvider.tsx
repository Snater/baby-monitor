import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';
import {PropsWithChildren, useEffect, useState} from 'react';
import {formatDate} from '@/lib/util';
import useIdContext from '@/components/IdContext';
import {useQuery} from '@tanstack/react-query';
import useStore from '@/store';

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {
	const {id} = useIdContext();
	/**
	 * Date to programmatically navigate to after (re)fetching the query.
	 */
	const [targetDate, setTargetDate] = useState<Date | undefined>();
	const [resetSync, setResetSync] = useState<{events: number[], delete: number[]} | undefined>();
	const currentDate = useStore(state => state.currentDate);
	const setCurrentDate = useStore(state => state.setCurrentDate);
	const addLoggedDates = useStore(state => state.addLoggedDates);
	const purgePendingEvents = useStore(state => state.purgePendingEvents);
	const purgePendingDelete = useStore(state => state.purgePendingDelete);

	const {data, fetchStatus, status} = useQuery<Event[]>({
		queryKey: ['data', id, currentDate],
		queryFn: async (): Promise<Event[]> => {
			const params = new URLSearchParams({
				id,
				date: currentDate as string,
				timezoneOffset: new Date().getTimezoneOffset().toString(),
			});
			const response = await fetch(`/api/get?${params.toString()}`);
			return response.json();
		},
		enabled: !!currentDate,
	});

	useEffect(() => {
		if (data) {
			addLoggedDates(data.reduce<string[]>((dates, event) => {
				const eventDate = formatDate(new Date(event.time));
				return dates.includes(eventDate) ? dates : [...dates, eventDate];
			}, []));
		}
	}, [addLoggedDates, data]);

	useEffect(() => {
		if (targetDate && fetchStatus !== 'fetching') {
			setTargetDate(undefined);
			setCurrentDate(formatDate(targetDate));
		}
	}, [fetchStatus, setCurrentDate, targetDate]);

	useEffect(() => {
		if (!resetSync || fetchStatus === 'fetching') {
			return;
		}

		if (resetSync.events.length > 0) {
			purgePendingEvents(resetSync.events);
		}

		if (resetSync.delete.length > 0) {
			purgePendingDelete(resetSync.delete);
		}

		setResetSync(undefined);
	}, [fetchStatus, resetSync, purgePendingDelete, purgePendingEvents]);

	return (
		<ChartDataContext.Provider
			value={{
				chartData: data && currentDate ? {events: data, selectedDate: currentDate} : undefined,
				setResetSync,
				setTargetDate,
				status,
			}}
		>
			{children}
		</ChartDataContext.Provider>
	);
}
