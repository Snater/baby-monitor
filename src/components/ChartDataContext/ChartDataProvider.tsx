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
	const currentDate = useStore(state => state.currentDate);
	const setCurrentDate = useStore(state => state.setCurrentDate);

	const {data, fetchStatus, status} = useQuery<Event[]>({
		queryKey: ['data', id, currentDate],
		queryFn: async (): Promise<Event[]> => {
			const response = await fetch(`/api/get?id=${id}&date=${currentDate}`);
			return response.json();
		},
		enabled: !!currentDate,
	});

	useEffect(() => {
		if (targetDate && fetchStatus !== 'fetching') {
			setTargetDate(undefined);
			setCurrentDate(formatDate(targetDate));
		}
	}, [fetchStatus, setCurrentDate, targetDate]);

	return (
		<ChartDataContext.Provider
			value={{
				chartData: data && currentDate ? {events: data, selectedDate: currentDate} : undefined,
				setTargetDate,
				status,
			}}
		>
			{children}
		</ChartDataContext.Provider>
	);
}
