import ChartDataContext from './ChartDataContext';
import type {Event} from '@/types';
import {PropsWithChildren} from 'react';
import useIdContext from '@/components/IdContext';
import {useQuery} from '@tanstack/react-query';

const timezoneOffset = new Date().getTimezoneOffset();

type Props = PropsWithChildren

export default function ChartDataProvider({children}: Props) {
	const {id} = useIdContext();

	const {data} = useQuery<Event[]>({
		queryKey: ['data', id],
		queryFn: async (): Promise<Event[]> => {
			const response = await fetch(`/api/get?id=${id}`);
			const events: Event[] = await response.json();
			return events.map(event => ({
				...event,
				time: new Date(new Date(event.time).getTime() - timezoneOffset * 60 * 1000).getTime(),
			}));
		},
	});

	return (
		<ChartDataContext.Provider value={{chartData: data}}>
			{children}
		</ChartDataContext.Provider>
	);
}
