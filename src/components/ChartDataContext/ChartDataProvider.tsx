import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';
import {PropsWithChildren, useEffect} from 'react';
import {formatDate} from '@/lib/util';
import useIdContext from '@/components/IdContext';
import {useQuery} from '@tanstack/react-query';
import useStore from '@/store';

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {
	const {id, isTemporary} = useIdContext();
	const currentDate = useStore(state => state.currentDate);
	const addLoggedDates = useStore(state => state.addLoggedDates);

	const {data, status} = useQuery<Event[]>({
		queryKey: ['data', id, currentDate],
		queryFn: async (): Promise<Event[]> => {
			const params = new URLSearchParams({
				id,
				// The local day's start time in UTC.
				date: new Date(`${currentDate as string}T00:00:00`).toISOString(),
			});
			const response = await fetch(`/api/get?${params.toString()}`);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			return response.json();
		},
		enabled: !!currentDate && !isTemporary,
	});

	useEffect(() => {
		if (data) {
			addLoggedDates([...new Set(data.map(event => formatDate(new Date(event.time))))]);
		}
	}, [addLoggedDates, data]);

	return (
		<ChartDataContext.Provider
			value={{
				chartData: data && currentDate ? {events: data, selectedDate: currentDate} : undefined,
				status: isTemporary ? 'success' : status,
			}}
		>
			{children}
		</ChartDataContext.Provider>
	);
}